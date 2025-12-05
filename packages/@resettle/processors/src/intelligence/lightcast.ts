import type { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import { load } from 'cheerio'
import { sql, type Kysely } from 'kysely'
import markdownIt from 'markdown-it'
import type OpenAI from 'openai'
import { toSql } from 'pgvector/kysely'
import slug from 'slug'

import {
  conditionalInMemoryDownload,
  getCurrentMonth,
  loadFile,
  refDirToRef,
  saveFile,
  type RefDir,
} from '../utils'

export type LightcastSkills = {
  name: 'Categories'
  children: {
    name: string
    children: {
      name: string
      children: {
        name: string
        id: string
        embedding?: number[]
      }[]
    }[]
  }[]
  embedded?: true
}

type RenameAction = {
  type: 'rename'
  fromName: string
  fromId: string
  to: string
}

type ConsolidateAction = {
  type: 'consolidate'
  fromName: string
  fromId: string
  toName: string
  toId: string
}

type AddAction = { type: 'add'; name: string; id: string }

type RemoveAction = { type: 'remove'; name: string; id: string }

const parseRenameItem = (value: string): RenameAction => {
  const parsed = /Renamed "(.+)" \((.+)\) to (.+)/.exec(value)!
  return {
    type: 'rename',
    fromName: parsed[1],
    fromId: parsed[2],
    to: parsed[3],
  }
}

const parseConsolidateItem = (value: string): ConsolidateAction => {
  const parsed = /Consolidated '"(.+)" \((.+)\)' into "(.+)" \((.+)\)/.exec(
    value,
  )!
  return {
    type: 'consolidate',
    fromName: parsed[1],
    fromId: parsed[2],
    toName: parsed[3],
    toId: parsed[4],
  }
}

const parseAddItem = (value: string): AddAction => {
  const parsed = /Added "(.+)" \((.+)\) as a/.exec(value)!
  return {
    type: 'add',
    name: parsed[1],
    id: parsed[2],
  }
}

const parseRemoveItem = (value: string): RemoveAction => {
  const parsed = /Removed skill "(.+)" \((.+)\)/.exec(value)!
  return {
    type: 'remove',
    name: parsed[1],
    id: parsed[2],
  }
}

export const processSkillsIncrementally = async (
  ctx: { s3: S3Client; db: Kysely<IntelligenceDatabase>; openai: OpenAI },
  ref: RefDir,
) => {
  const deltaFilename = `skills-delta-${getCurrentMonth()}.md`
  const fullFilename = `skills.json`
  const realDeltaRef = refDirToRef(ref, `lightcast/${deltaFilename}`)
  const realFullRef = refDirToRef(ref, `lightcast/${fullFilename}`)
  const fullContent = await loadFile(ctx, realFullRef, { stream: false })
  if (!fullContent.success) {
    throw new Error('Skills were never downloaded before')
  }

  const oldParsed = JSON.parse(
    fullContent.data.toString('utf-8'),
  ) as LightcastSkills
  if (!oldParsed.embedded) {
    throw new Error('Skills were never processed before')
  }

  const oldSkills: {
    category: string
    sub_category: string
    slug: string
    name: string
    id: string
    embedding: number[]
  }[] = []
  for (const category of oldParsed.children) {
    for (const subCategory of category.children) {
      for (const item of subCategory.children) {
        oldSkills.push({
          category: category.name,
          sub_category: subCategory.name,
          slug: slug(`skill-${item.name}`),
          name: item.name,
          id: item.id,
          embedding: item.embedding!,
        })
      }
    }
  }

  let updated = false
  const resp = await fetch('https://lightcast.io/api/skills/skill-categories')
  const newParsed = (await resp.json()) as LightcastSkills

  const newSkills: {
    category: string
    sub_category: string
    slug: string
    name: string
    id: string
    embedding?: number[]
  }[] = []
  for (const category of newParsed.children) {
    for (const subCategory of category.children) {
      for (const item of subCategory.children) {
        newSkills.push({
          category: category.name,
          sub_category: subCategory.name,
          slug: slug(`skill-${item.name}`),
          name: item.name,
          id: item.id,
        })
        const foundOldSkill = oldSkills.find(s => s.id === item.id)
        if (!foundOldSkill) {
          updated = true
        } else {
          newSkills[newSkills.length - 1].embedding = foundOldSkill.embedding
          item.embedding = foundOldSkill.embedding
        }
      }
    }
  }

  // We also need to check if there's removed old skills
  if (
    !oldSkills
      .map(os => os.id)
      .every(osId => newSkills.find(ns => ns.id === osId))
  ) {
    updated = true
  }

  // NOTE: It's still possible that the remote source provides inconsistent delta or update multiple times in one month, current logic won't apply correctly if they happen.
  if (updated) {
    const deltaContent = (
      await conditionalInMemoryDownload(
        ctx.s3,
        realDeltaRef,
        'https://emsiservices.com/docs-site-proxy?url=https://emsiservices.com/skills/docs/data-changelog',
      )
    ).toString('utf-8')
    const md = markdownIt({ html: true })
    const html = md.render(deltaContent)
    const $ = load(html)
    const first = $('h2').eq(0)
    const selected = first.next().nextUntil('h2')
    const items: string[] = []
    selected.each((_i, e) => {
      if (e.tagName === 'div') {
        items.push(
          ...$(e)
            .text()
            .trim()
            .split('\n')
            .filter(t => t.length > 0),
        )
      }
    })

    const renameActions: RenameAction[] = []
    const consolidateActions: ConsolidateAction[] = []
    const addActions: AddAction[] = []
    const removeActions: RemoveAction[] = []
    for (const item of items) {
      if (item.startsWith('Renamed')) {
        renameActions.push(parseRenameItem(item))
      } else if (item.startsWith('Consolidated')) {
        consolidateActions.push(parseConsolidateItem(item))
      } else if (item.startsWith('Added')) {
        addActions.push(parseAddItem(item))
      } else if (item.startsWith('Removed')) {
        removeActions.push(parseRemoveItem(item))
      }
    }

    for (const remove of removeActions) {
      await ctx.db
        .updateTable('tag_template')
        .set('deprecated_at', sql`now()`)
        .where('name', '=', remove.name)
        .execute()
    }

    for (const consolidate of consolidateActions) {
      const oldTag = await ctx.db
        .selectFrom('tag_template')
        .selectAll()
        .where('name', '=', consolidate.fromName)
        .executeTakeFirst()
      const newTag = await ctx.db
        .selectFrom('tag_template')
        .selectAll()
        .where('name', '=', consolidate.toName)
        .executeTakeFirst()
      if (!oldTag || !newTag) {
        continue
      }

      await ctx.db.transaction().execute(async tx => {
        await tx
          .updateTable('tag_template')
          .set('deprecated_at', sql`now()`)
          .where('id', '=', oldTag.id)
          .execute()
        await tx
          .updateTable('profile_tag')
          .set('tag_template_id', newTag.id)
          .where('tag_template_id', '=', oldTag.id)
          .execute()
      })
    }

    const renameNames: {
      category: string
      sub_category: string
      id: string
      from: string
      slug: string
      to: string
      embedding?: number[]
    }[] = []
    for (const rename of renameActions) {
      const found = oldSkills.find(
        s => s.id === rename.fromId && s.name === rename.fromName,
      )
      if (found) {
        renameNames.push({
          category: found.category,
          sub_category: found.sub_category,
          id: found.id,
          from: found.name,
          slug: slug(`skill-${rename.to}`),
          to: rename.to,
        })
      }
    }

    const renamePageCount = Math.ceil(renameNames.length / 1000)
    for (let i = 0; i < renamePageCount; i++) {
      const names = renameNames.slice(i * 1000, (i + 1) * 1000)
      const res = await ctx.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: names.map(n => n.to),
      })

      const embeddings = res.data.map(d => d.embedding)
      for (let j = 0; j < names.length; j++) {
        const skill = renameNames[j]
        skill.embedding = embeddings[j]
        newParsed.children
          .find(p => p.name === skill.category)!
          .children.find(p => p.name === skill.sub_category)!
          .children.find(p => p.name === skill.to)!.embedding = embeddings[j]
      }
      console.log(`Embeddings of page ${i} processed.`)
    }

    for (const rename of renameNames) {
      await ctx.db
        .updateTable('tag_template')
        .set('slug', rename.slug)
        .set('name', rename.to)
        .set('embedding', toSql(rename.embedding!))
        .where('name', '=', rename.from)
        .execute()
    }

    const addNames: {
      category: string
      sub_category: string
      id: string
      slug: string
      name: string
      embedding?: number[]
    }[] = []
    for (const add of addActions) {
      const found = newSkills.find(s => s.id === add.id && s.name === add.name)
      if (found) {
        addNames.push({
          category: found.category,
          sub_category: found.sub_category,
          id: found.id,
          slug: slug(`skill-${found.name}`),
          name: found.name,
        })
      }
    }

    const addPageCount = Math.ceil(addNames.length / 1000)
    for (let i = 0; i < addPageCount; i++) {
      const names = addNames.slice(i * 1000, (i + 1) * 1000)
      const res = await ctx.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: names.map(n => n.name),
      })

      const embeddings = res.data.map(d => d.embedding)
      for (let j = 0; j < names.length; j++) {
        const skill = addNames[i * 1000 + j]
        skill.embedding = embeddings[j]
        newParsed.children
          .find(p => p.name === skill.category)!
          .children.find(p => p.name === skill.sub_category)!
          .children.find(p => p.name === skill.name)!.embedding = embeddings[j]
      }
      console.log(`Embeddings of page ${i} processed.`)
    }

    for (let i = 0; i < addPageCount; i++) {
      await ctx.db
        .insertInto('tag_template')
        .values(
          addNames.slice(i * 1000, (i + 1) * 1000).map(s => ({
            slug: s.slug,
            name: s.name,
            namespace: 'skill',
            embedding: toSql(s.embedding!),
            metadata: JSON.stringify({
              namespace: 'skill',
              category: s.category,
              sub_category: s.sub_category,
              external_id: s.id,
            }),
          })),
        )
        .execute()
    }

    newParsed.embedded = true
    await saveFile(ctx, realFullRef, JSON.stringify(newParsed), {})
    console.log(`All embeddings processed successfully.`)
  }

  return updated
}

export const processSkillsCompletely = async (
  ctx: { s3: S3Client; db: Kysely<IntelligenceDatabase>; openai: OpenAI },
  ref: RefDir,
) => {
  const filename = `skills.json`
  const realRef = refDirToRef(ref, `lightcast/${filename}`)
  const content = (
    await conditionalInMemoryDownload(
      ctx.s3,
      realRef,
      'https://lightcast.io/api/skills/skill-categories',
    )
  ).toString('utf-8')
  const parsed = JSON.parse(content) as LightcastSkills
  const skills: {
    category: string
    sub_category: string
    name: string
    slug: string
    id: string
    embedding?: number[]
  }[] = []
  for (const category of parsed.children) {
    for (const subCategory of category.children) {
      for (const item of subCategory.children) {
        skills.push({
          category: category.name,
          sub_category: subCategory.name,
          name: item.name,
          slug: slug(`skill-${item.name}`),
          id: item.id,
          embedding: item.embedding,
        })
      }
    }
  }

  const pageCount = Math.ceil(skills.length / 1000)

  if (!parsed.embedded) {
    console.log(`Embeddings not found, processing...`)
    for (let i = 0; i < pageCount; i++) {
      const pages = skills.slice(i * 1000, (i + 1) * 1000)
      const res = await ctx.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: pages.map(p => p.name),
      })

      const embeddings = res.data.map(d => d.embedding)
      for (let j = 0; j < pages.length; j++) {
        const skill = skills[i * 1000 + j]
        skill.embedding = embeddings[j]
        parsed.children
          .find(p => p.name === skill.category)!
          .children.find(p => p.name === skill.sub_category)!
          .children.find(p => p.name === skill.name)!.embedding = embeddings[j]
      }
      console.log(`Embeddings of page ${i} processed.`)
    }

    parsed.embedded = true
    await saveFile(ctx, realRef, JSON.stringify(parsed), {})
    console.log(`All embeddings processed successfully.`)
  }

  for (let i = 0; i < pageCount; i++) {
    await ctx.db
      .insertInto('tag_template')
      .values(
        skills.slice(i * 1000, (i + 1) * 1000).map(s => ({
          slug: s.slug,
          name: s.name,
          namespace: 'skill',
          embedding: toSql(s.embedding!),
          metadata: JSON.stringify({
            namespace: 'skill',
            category: s.category,
            sub_category: s.sub_category,
            external_id: s.id,
          }),
        })),
      )
      .execute()
  }
}
