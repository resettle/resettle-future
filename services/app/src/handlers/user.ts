import {
  updateUserProfileById as dbUpdateUserProfileById,
  getUserById,
  type AppDatabase,
} from '@resettle/database/app'
import type { UserProfile } from '@resettle/schema/app'
import type { Kysely } from 'kysely'
import type { OpenAI } from 'openai'

import { determineIsSTEM } from '../libs/education-experience'

/**
 * Updates a user profile by ID
 * @param ctx - The context object containing the database and OpenAI client
 * @param ctx.db - The Kysely database instance
 * @param ctx.openai - The OpenAI client
 * @param params - The parameters object
 * @param params.userId - The ID of the user to update
 * @param params.profile - The profile to update
 * @returns The updated user profile
 */
export const updateUserProfileById = async (
  ctx: {
    db: Kysely<AppDatabase>
    openai: OpenAI
  },
  params: {
    userId: string
    profile: UserProfile
  },
) => {
  const user = await getUserById(ctx.db, params.userId)

  if (!user) {
    return null
  }

  if (
    params.profile.education_experiences &&
    params.profile.education_experiences.length > 0
  ) {
    const existingEducationExperiences =
      user.profile?.education_experiences || []

    const updatedEducationExperiences = await Promise.all(
      params.profile.education_experiences.map(async experience => {
        // Find the existing education experience by ID
        const existingExperience = existingEducationExperiences.find(
          exp => exp.id === experience.id,
        )

        // Determine if we need to re-calculate STEM status
        const needsSTEMDetermination =
          experience.is_stem === undefined || // New experience without STEM status
          existingExperience === undefined || // New experience
          existingExperience.field_of_study !== experience.field_of_study // Field of study changed

        if (needsSTEMDetermination) {
          const isSTEM = await determineIsSTEM(ctx.openai, experience)

          return {
            ...experience,
            is_stem: isSTEM,
          }
        }

        return experience
      }),
    )

    params.profile.education_experiences = updatedEducationExperiences
  }

  return await dbUpdateUserProfileById(ctx.db, user.id, params.profile)
}
