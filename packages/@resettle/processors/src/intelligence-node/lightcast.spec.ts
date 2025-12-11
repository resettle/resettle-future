import { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { SkillTagMetadata } from '@resettle/schema/intelligence'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely'
import assert from 'node:assert'
import { promises as fs } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import { cwd } from 'node:process'
import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  it,
  mock,
} from 'node:test'
import OpenAI from 'openai'
import { Pool } from 'pg'
import { MockAgent, setGlobalDispatcher } from 'undici'

import {
  processSkillsCompletely,
  processSkillsIncrementally,
  type LightcastSkills,
} from './lightcast'

const skills = {
  name: 'Categories',
  children: [
    {
      name: 'Information Technology',
      children: [
        {
          name: 'Microsoft Development Tools',
          children: [
            {
              name: '.NET Assemblies',
              id: 'KS126XS6CQCFGC3NG79X',
            },
            {
              name: '.NET Framework',
              id: 'KS1200B62W5ZF38RJ7TD',
            },
            {
              name: '.NET Framework 1',
              id: 'KS126XW78QJCF4TRV2X7',
            },
            {
              name: '.NET Framework 4',
              id: 'KS126XR63RKYVCKYDNBN',
            },
            {
              name: '.NET MAUI (Multi-Platform App UI)',
              id: 'ES1A2175859F80D25163',
            },
            {
              name: '.NET Micro Framework',
              id: 'ES883256111E949945F1',
            },
          ],
        },
      ],
    },
  ],
} satisfies LightcastSkills

const skills2 = {
  name: 'Categories',
  children: [
    {
      name: 'Information Technology',
      children: [
        {
          name: 'Microsoft Development Tools',
          children: [
            {
              name: '.NET Assemblies',
              id: 'KS126XS6CQCFGC3NG79X',
            },
            {
              name: '.NET Framework',
              id: 'KS1200B62W5ZF38RJ7TD',
            },
            {
              name: '.NET Framework 3',
              id: 'KS126XY68BNKXSBSLPYS',
            },
            {
              name: '.NET MAUI',
              id: 'ES1A2175859F80D25163',
            },
            {
              name: '.NET Micro Framework',
              id: 'ES883256111E949945F1',
            },
          ],
        },
      ],
    },
  ],
} satisfies LightcastSkills

const delta = `# Skills Taxonomy Changelog

All notable changes to Lightcast's Skill Taxonomy database will be documented in this file.

If you have questions, please contact us by emailing our engineering team at [customersupport@lightcast.io](mailto:customersupport@lightcast.io).

## 9.37 (November 11, 2025)

### Changed

<div class="tabs">


<div data-tab="Renames (1)">

* Renamed \`".NET MAUI (Multi-Platform App UI)" (ES1A2175859F80D25163)\` to \`.NET MAUI\`

</div>


<div data-tab="Consolidations (1)">

* Consolidated '\`".NET Framework 4" (KS126XR63RKYVCKYDNBN)\`' into \`".NET Framework" (KS1200B62W5ZF38RJ7TD)\`

</div>


<div data-tab="Tagging Changes (1)">

* Altered tagging criteria for \`"AI Translation" (ESCBAB556CA766ECCD6E)\`

</div>


</div>

### Added

<div data-toggle="All 1 Additions">

* Added \`".NET Framework 3" (KS126XY68BNKXSBSLPYS)\` as a \`Specialized Skill\`

</div>

### Removed

<div class="tabs">
<div data-tab="Removals (1)">

* Removed skill \`".NET Framework 1" (KS126XW78QJCF4TRV2X7)\`

</div>


</div>

<div class="internal-only">

### Internal Only
<div data-toggle="All 54 Changes">

* Blacklisted \`AI TRANSLATION ASSISTANT\`
* Blacklisted \`APPLY TOWARD AI TRANSLATION\`
* Blacklisted \`VAE EQA OPPORTNTY\`
* Blacklisted \`REFERENCE NUMBER 274-11524-AI\`
* Blacklisted \`PLEASE NOTE THE USE OF AI IS MONITORED AND IF YOU HAVE USED IT IN YOUR APPLICATION YOU ARE REQUIRED TO DECLARE THIS\`
* Blacklisted \`TRANSFORM THEIR HR FUNCTIONS WITH AI\`
* Blacklisted \`WHAT SHOULD MY AI STRATEGY BE FOR THE HR FUNCTION\`
* Blacklisted \`AI CANNOT TRULY UNDERSTAND THE SPECIFIC JOB\`
* Blacklisted \`WHILE WE UNDERSTAND THAT AI TOOLS ARE WIDELY AVAILABLE, WE STRONGLY DISCOURAGE APPLICANTS FROM USING AI-GENERATED CONTENT WHEN APPLYING FOR JOBS WITH US\`
* Blacklisted \`WHILE ARTIFICIAL INTELLIGENCE (AI) CAN AID YOU IN COMPLETING YOUR APPLICATION, THESE TOOLS CANNOT FULLY GRASP THE CONTEXT OF REQUIREMENTS OF THE JOB\`
* Blacklisted \`WHILE AI TOOLS CAN BE HELPFUL IN GENERATING IDEAS\`
* Blacklisted \`WE UNDERSTAND THAT AI TOOLS ARE WIDELY AVAILABLE\`
* Blacklisted \`AI HAS BEEN USED THEN THE APPLICATION MAY BE REJECTED\`
* Blacklisted \`AI IN RECRUITMENT\`
* Blacklisted \`WE UNDERSTAND THAT AI TOOLS ARE AVAILABLE\`
* Blacklisted \`WE DISCOURAGE OVER RELIANCE ON AI-GENERATED APPLICATIONS AS IT WILL LESSEN YOUR CHANCES\`
* Blacklisted \`WE ARE AWARE THAT AN INCREASING NUMBER OF APPLICANTS AREUSING AI TECHNOLOGY TO GENERATE RESPONSES ON NHS JOB APPLICATION FORMS\`
* Blacklisted \`AI TO GENERATE THEIR ANSWERS\`
* Blacklisted \`AI TO WRITE YOUR APPLICATION\`
* Blacklisted \`SAMMIE MOSIER, DHA, MA, BSN, NE-BC\`
* Blacklisted \`AI TOOLS LACK THE AUTHENTICITY AND ABILITY TO SHOWCASE A CANDIDATE'S BREADTH OF KNOWLEDGE\`
* Blacklisted \`AI USAGE GUIDANCE\`
* Blacklisted \`PLEASE BE AWARE, THE USE OF ARTIFICIAL INTELLIGENCE (AI) WHEN SUBMITTING AN APPLICATION IS MONITORED\`
* Blacklisted \`AI-GENERATED CONTENT\`
* Blacklisted \`USING AI FOR YOUR APPLICATION\`
* Blacklisted \`AI-GENERATED APPLICATIONS\`
* Blacklisted \`PLEASE BE AWARE THAT THE USE OF ARTIFICIAL INTELLIGENCE (AI) IN COMPLETING APPLICATION FORMS WILL BE MONITORED\`
* Blacklisted \`IF YOU HAVE USED AI YOU MUST STATE THIS IN YOUR APPLICATION\`
* Blacklisted \`IF YOU HAVE USED AI TO GENERATE AN APPLICATION, YOU ARE REQUIRED TO DECLARE THIS ON YOUR APPLICATION FORM\`
* Blacklisted \`IF YOU HAVE USED AI TO GENERATE AN APPLICATION\`
* Blacklisted \`IF YOU ARE USING AI TO ENHANCE YOURAPPLICATION, PLEASE DISCLOSE THIS IN YOUR NHS JOBS APPLICATION FORM\`
* Blacklisted \`RELYING SOLELY ON AI TO WRITE YOUR APPLICATION\`
* Blacklisted \`IF YOU ARE USING AI TO ENHANCE YOUR APPLICATION\`
* Blacklisted \`NATURAL BLISS COFFEE ENHANCER PRODUCTS\`
* Blacklisted \`HELP OF AI WHEN WRITING JOB APPLICATION\`
* Blacklisted \`GUIDANCE ON AI USAGE DOCUMENT WHICH CAN BE FOUND BELOW\`
* Blacklisted \`CANDIDATES THAT USE AI TO GENERATE THEIR ANSWERS\`
* Blacklisted \`AI-GENERATED TEXT\`
* Blacklisted \`CANDIDATE MAY UTILISE THE HELP OF AI WHEN WRITING JOB APPLICATION\`
* Blacklisted \`ARTIFICIAL INTELLIGENCE (AI) HAS BEEN USED IN YOUR APPLICATION\`
* Blacklisted \`CANDIDATES ARE ADVISED TO AVOID USE OF CHATGPT OR SIMILAR AI SUPPORT WHEN COMPLETING YOUR APPLICATION\`
* Blacklisted \`USE AI TO GENERATE THEIR ANSWERS\`
* Blacklisted \`USE AI TOOLS RESPONSIBLY TO ENSURE YOUR APPLICATION\`
* Blacklisted \`USE OF AI\`
* Blacklisted \`USE OF AI IS MONITORED\`
* Blacklisted \`AIGENERATED TEXT\`
* Blacklisted \`USE OF ARTIFICIAL INTELLIGENCE (AI)\`
* Blacklisted \`USE OF ARTIFICIAL INTELLIGENCE (AI) APPLICATIONS\`
* Blacklisted \`USE OF ARTIFICIAL INTELLIGENCE (AI) APPLICATIONS FOR THIS ROLE SHOULD BE WRITTEN BY THE APPLICANT\`
* Blacklisted \`AIGENERATED CONTENT\`
* Blacklisted \`USES TOOLS TO SCREEN ANY APPLICATIONS GENERATED BY ARTIFICIAL INTELLIGENCE (AI)\`
* Blacklisted \`PLEASE DECLARE WITHIN THE SUPPORTING INFORMATION IF ARTIFICIAL INTELLIGENCE (AI) HAS BEEN USED IN YOUR APPLICATION\`
* Blacklisted \`AIGENERATED APPLICATIONS\`
* Blacklisted \`APPLICANTS ARE USING AI TECHNOLOGY TO GENERATE RESPONSES\`

</div>


</div>


</div>



## 9.36 (October 16, 2025)

### Changed

<div class="tabs">


<div data-tab="Renames (4)">

* Renamed \`"Bagging Techniques" (ES8B5ECCFED2DE03685F)\` to \`Bootstrap Aggregating (Bagging)\`
* Renamed \`"Boiler Operator" (ES4BE672262A11922089)\` to \`Boiler Operator License\`
* Renamed \`"Experimental Design" (KS122VN73RX0QR6GMDHV)\` to \`Design of Experiments (DOE)\`
* Renamed \`"Hearing Instrument Specialist" (KS124N671F465DYN6CGH)\` to \`Certified Hearing Instrument Specialist\`

</div>


<div data-tab="Type Changes (19)">

* Changed \`"Apple IPad" (KS120KH6GKCMVFHQGL11)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Boiler Operator License" (ES4BE672262A11922089)\` from a \`Specialized Skill\` to a \`Certification\`
* Changed \`"Case Study" (ES3892183E55561AE833)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"DO-178B/C (Software Considerations in Airborne Systems and Equipment Certification)" (ES79D7274626AE5F18F1)\` from a \`Certification\` to a \`Specialized Skill\`
* Changed \`"Dollies" (BGS7C5C5DDBBFEC89BA4)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Electrical Metallic Tubing" (ESB1A7C7BE6A9DDBBC6D)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"FaceTime" (KS123SX63GRSR71T1GD6)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Hand Signals" (KS124L86M0JCWKKW79G7)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Hand Trucks" (BGS6712A075FC970319B)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Handheld PC" (KS124LB6WDYRVRQQ4FWF)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Learning Mindset" (ESA010506887B0AD41BF)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"Linens" (KS125VQ6QCVMVXM06L0J)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"Message Etiquette" (ES3A2E3EE244ABA98A16)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"Natural Sciences" (KS126W0795QSLZ0QZVW3)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Real Estate" (KS128F265DV4XTBR70H7)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Self-Advocacy" (ES739643E17EA4EB3522)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"Sustainable Event Management" (ES54EB16E24E2448E4EF)\` from a \`Common Skill\` to a \`Specialized Skill\`
* Changed \`"Video Call Etiquette" (ESDF8C8E32F6D4C98781)\` from a \`Specialized Skill\` to a \`Common Skill\`
* Changed \`"Workplace Communication" (ES9E3CB9A138E23B77F0)\` from a \`Specialized Skill\` to a \`Common Skill\`

</div>


<div data-tab="Consolidations (1)">

* Consolidated '\`"Underwater Diving" (ES6D0084536C7F576A18)\`' into \`"Diving" (KS1232C726JF2HF2J1DQ)\`

</div>


<div data-tab="Tagging Changes (1)">

* Altered tagging criteria for \`"AI Agent Monitoring" (LCSV63BJYU9JR83GHQIG)\`

</div>


</div>

### Added

<div data-toggle="All 128 Additions">

* Added \`".NET Micro Framework" (ES883256111E949945F1)\` as a \`Specialized Skill\`
* Added \`"AWS Application Discovery Service" (ES6FF82DB7B9D26A54C4)\` as a \`Specialized Skill\`
* Added \`"AWS Tools" (ESD2EB9D83E0ACBB0299)\` as a \`Specialized Skill\`
* Added \`"Analytical Method" (ESE2EEC087B4FBAC356F)\` as a \`Specialized Skill\`
* Added \`"Animal Origin Product Handling" (ES8F0925796E68F23A6F)\` as a \`Specialized Skill\`
* Added \`"Apnea Monitors" (ESCD69DBDCF491F343BA)\` as a \`Specialized Skill\`
* Added \`"Application Hosting" (ESC2A9F28C1FB2815BC7)\` as a \`Specialized Skill\`
* Added \`"Application Infrastructure Design" (ES9EF42249F117803CA1)\` as a \`Specialized Skill\`
* Added \`"Aseptic Integrity" (ES37CCE19FCC5DC9FC92)\` as a \`Specialized Skill\`
* Added \`"Asset Pipeline" (ES6FF5385D9114EFE193)\` as a \`Specialized Skill\`
* Added \`"Asset Restructuring" (ES31D1C3C5AA81FB528E)\` as a \`Specialized Skill\`
* Added \`"Asset Sales" (ES33B8F5289BE7264E95)\` as a \`Specialized Skill\`
* Added \`"Asset Transfers" (ESE2725C3EA120B8882B)\` as a \`Specialized Skill\`
* Added \`"Athletic Coaching Certificate" (ESB5E258C0A62E80EE8B)\` as a \`Certification\`
* Added \`"Atmospheric Monitoring" (ESBDE6375CAC2197413C)\` as a \`Specialized Skill\`
* Added \`"Atrial Fibrillation Ablation" (ESF62D07F39F0AC02C3B)\` as a \`Specialized Skill\`
* Added \`"Autism Assessment" (ES32A929491B4682A598)\` as a \`Specialized Skill\`
* Added \`"AutoTrack" (ESC1063DFE9AB0AA1CD1)\` as a \`Specialized Skill\`
* Added \`"Autocartoner" (ES148E133328F4A99376)\` as a \`Specialized Skill\`
* Added \`"Autocode Generation" (ESA5FBED28B05CEA3B3D)\` as a \`Specialized Skill\`
* Added \`"Automated Billing Software" (ES24C72AFDEAA4F888D8)\` as a \`Specialized Skill\`
* Added \`"Automated Payroll Software" (ES4F1B4B17A9D8316AF5)\` as a \`Specialized Skill\`
* Added \`"Automotive Glass Repair" (ES17B4C07753414CAAF1)\` as a \`Specialized Skill\`
* Added \`"Automotive Knowledge" (ES28CB3A1727DD431C68)\` as a \`Specialized Skill\`
* Added \`"Azure Backup" (ESB4B4A59CED68D42BAB)\` as a \`Specialized Skill\`
* Added \`"Azure Notification Hubs" (ES98EF90EA8B87A63E74)\` as a \`Specialized Skill\`
* Added \`"Backup Management" (ESFC4B21C8162AD12D54)\` as a \`Specialized Skill\`
* Added \`"Backup and Recovery Software" (ES37F996AFC2F6F55F62)\` as a \`Specialized Skill\`
* Added \`"Backup and Recovery System" (ES2E1809BF8D302D0CCC)\` as a \`Specialized Skill\`
* Added \`"Balances Stakeholders" (ESEA8058F5B384C17AA4)\` as a \`Specialized Skill\`
* Added \`"Biological Studies" (ES72DA2F8A297B81D641)\` as a \`Specialized Skill\`
* Added \`"Biomagnetism" (ESAACE900DE781A7A2AA)\` as a \`Specialized Skill\`
* Added \`"Biomaterials Engineering" (ES54E841F1E1E4E7B925)\` as a \`Specialized Skill\`
* Added \`"Biomaterials Science" (ES3FCE2280482D5E6BF9)\` as a \`Specialized Skill\`
* Added \`"Biomechanics Research" (ES8FF16F921C258E5F68)\` as a \`Specialized Skill\`
* Added \`"Blockchain Identity" (ESB8F91BAC2A0F7C1A95)\` as a \`Specialized Skill\`
* Added \`"Broaching Machines" (ESD5EA253BE612F29087)\` as a \`Specialized Skill\`
* Added \`"Brocade DCX" (ES26844BD812FB597DD7)\` as a \`Specialized Skill\`
* Added \`"Brocade Fibre Channel Switches" (ES4A6396132D91397230)\` as a \`Specialized Skill\`
* Added \`"Builds Effective Teams" (ESBFE09A6B82521843D2)\` as a \`Common Skill\`
* Added \`"Business Intelligence Dashboards" (ES39107B32B3201AE37C)\` as a \`Specialized Skill\`
* Added \`"Business Intelligence Implementation" (ES61967BADE3DA8707DE)\` as a \`Specialized Skill\`
* Added \`"Business Intelligence Management" (ES462D34E9899865E948)\` as a \`Specialized Skill\`
* Added \`"Business Intelligence System (BIS)" (ESB94D7DA4CEDA5F4E6A)\` as a \`Specialized Skill\`
* Added \`"Business Management Certification" (ES648F801273E5829A60)\` as a \`Certification\`
* Added \`"Business Management Development" (ESE742D544549E72E968)\` as a \`Specialized Skill\`
* Added \`"CAiCE (Computer Aided Civil Engineering)" (ESCD697694163A387DC0)\` as a \`Specialized Skill\`
* Added \`"Cellular Agriculture" (ES783F22E1174D19DD8E)\` as a \`Specialized Skill\`
* Added \`"Cereals Technology" (ES73C02C6D6BBA75E7F5)\` as a \`Specialized Skill\`
* Added \`"Clean-in-Place (CIP) Cycle – Sanitisation" (ES73A89680D4B25BF323)\` as a \`Specialized Skill\`
* Added \`"Coffee Creamer" (ES10A948D0B5B0CFC245)\` as a \`Specialized Skill\`
* Added \`"Coffee Extraction" (ES377E876DE4F29DFB49)\` as a \`Specialized Skill\`
* Added \`"Coffee Grinding" (ES61610479B3BDF3A266)\` as a \`Specialized Skill\`
* Added \`"Coffee Manufacturing" (ESBB3D1E6A3A2A640041)\` as a \`Specialized Skill\`
* Added \`"Dosing" (ESD511B09B2795FF5848)\` as a \`Common Skill\`
* Added \`"Drum Drying" (ESA55474611C5E11685B)\` as a \`Specialized Skill\`
* Added \`"Dry Mixing" (ES921DA4C897EABAB95E)\` as a \`Specialized Skill\`
* Added \`"Emulsifier" (ESD63ADE407FAD1A3371)\` as a \`Specialized Skill\`
* Added \`"Emulsion" (ES3E370D0B74EFF9A284)\` as a \`Specialized Skill\`
* Added \`"Environmental Sustainability" (ES4EF59638AB8DF45DA3)\` as a \`Specialized Skill\`
* Added \`"Evaporation" (ESCBED3D8B807BC6A736)\` as a \`Specialized Skill\`
* Added \`"Experimental Learning" (ES7EA9220A17324352DB)\` as a \`Common Skill\`
* Added \`"Explosion Prevention" (ESFDF8EABB0C4D351507)\` as a \`Specialized Skill\`
* Added \`"Flow Wrapping" (ES2BE455A73A497F8FF9)\` as a \`Specialized Skill\`
* Added \`"Food Fortification" (ES265589742E324A7541)\` as a \`Specialized Skill\`
* Added \`"Foreign Body Prevention" (ES18CA164B19FB63D64D)\` as a \`Specialized Skill\`
* Added \`"Glass Handling" (ES1EB678DC8934782CC9)\` as a \`Specialized Skill\`
* Added \`"Global Perspective" (ESE97157F0D3A2F5E410)\` as a \`Common Skill\`
* Added \`"Grain Handling" (ES987AA8D8AF549F223F)\` as a \`Specialized Skill\`
* Added \`"Halal Compliance" (ESE54C96726331AA314D)\` as a \`Specialized Skill\`
* Added \`"Heat Balance" (ES6D27F12615F2DAABAC)\` as a \`Specialized Skill\`
* Added \`"Horizontal Form-Fill-Seal (HFFS)" (ES1505D54A6DABD3853E)\` as a \`Specialized Skill\`
* Added \`"Hot Filling" (ES2843B80E51A3760ED0)\` as a \`Specialized Skill\`
* Added \`"Hydrological Studies" (ES1695FF81AA722024FB)\` as a \`Specialized Skill\`
* Added \`"IWS Management" (ES7E6AD92E2EFA98BA1B)\` as a \`Specialized Skill\`
* Added \`"Industry 5.0 Implementation" (ES5027B4BE19A139B387)\` as a \`Specialized Skill\`
* Added \`"Infant Cereals" (ES3DF4F5C2A698D1508C)\` as a \`Specialized Skill\`
* Added \`"Infant Formula" (ESBF55E7078E22D71C48)\` as a \`Specialized Skill\`
* Added \`"Ingredient Batching" (ESD1A48F10F48A95CE97)\` as a \`Specialized Skill\`
* Added \`"Ingredient Declaration" (ESFEBB258B653E717BBF)\` as a \`Specialized Skill\`
* Added \`"Innovation Adoption" (ES4306C1AE1DAADB1262)\` as a \`Common Skill\`
* Added \`"Instrument Management" (ES71DC4B4476B9F1D0C8)\` as a \`Specialized Skill\`
* Added \`"Ionic Equilibria" (ESF8C4614D77D8AC5CFA)\` as a \`Specialized Skill\`
* Added \`"Journeyman Plumber" (ES3B161BE8AE45BCD671)\` as a \`Certification\`
* Added \`"Kosher Compliance" (ES72E675331E914D4C75)\` as a \`Specialized Skill\`
* Added \`"Kosher" (ESEBD326BED08BA4FFE9)\` as a \`Specialized Skill\`
* Added \`"Lactose Crystallization" (ES634F38839CD702498E)\` as a \`Specialized Skill\`
* Added \`"Lipid Oxidation" (ES2B6FC56124AFFDD34D)\` as a \`Specialized Skill\`
* Added \`"Magnetic Agitator" (ES4F1FFA555B9A683950)\` as a \`Specialized Skill\`
* Added \`"Master Sanitation Plan" (ES2A13F3CEF05A0766FF)\` as a \`Specialized Skill\`
* Added \`"Method Development" (ES8243CEB136649EB7D2)\` as a \`Specialized Skill\`
* Added \`"Method Qualification" (ES30882935131128248C)\` as a \`Specialized Skill\`
* Added \`"Microbe identification" (ESA56BBA637CCF452E80)\` as a \`Specialized Skill\`
* Added \`"Microbial Contamination" (ES6F94969FB6624EBD4A)\` as a \`Specialized Skill\`
* Added \`"Micronutrients" (ESE237F2144FB39A3A8D)\` as a \`Specialized Skill\`
* Added \`"Milk Component Analysis" (ES27A653931D62B919C7)\` as a \`Specialized Skill\`
* Added \`"Milk Composition Analysis" (ESC9E134887EC4423F1B)\` as a \`Specialized Skill\`
* Added \`"Milk Powder Processing" (ES9D0C3FCF4C8D5B9690)\` as a \`Specialized Skill\`
* Added \`"Milk Protein Analysis" (ESDEF94DEC5D0386E5DB)\` as a \`Specialized Skill\`
* Added \`"Moisture Analysis in Food" (ES14558C7A90195CE0F9)\` as a \`Specialized Skill\`
* Added \`"Mold Prevention" (ES9E4EC12878F04E2894)\` as a \`Specialized Skill\`
* Added \`"Monitoring Plan" (ES13CB4B1FFB3B7B4AFC)\` as a \`Specialized Skill\`
* Added \`"Nutritional Compliance" (ES5A750CB8569BECDC70)\` as a \`Specialized Skill\`
* Added \`"Nutritional Product Compliance" (ESFB7FECBC503684DF65)\` as a \`Specialized Skill\`
* Added \`"Package Integrity" (ESE7A371513F977E01F6)\` as a \`Specialized Skill\`
* Added \`"Packaging Material Handling" (ESBCBCA9C759289B19A7)\` as a \`Specialized Skill\`
* Added \`"Packing and Filling Lines Operation" (ESBD7A170519DB62F5FE)\` as a \`Specialized Skill\`
* Added \`"Paper Coating" (ES286F07D32DD4569EF7)\` as a \`Specialized Skill\`
* Added \`"Paper-Based Packaging" (ES1B38AD685A8EB58022)\` as a \`Specialized Skill\`
* Added \`"Petcare" (ES7AE65629E6CD7431EB)\` as a \`Specialized Skill\`
* Added \`"Pneumatic Conveying" (ESBB347002B397525EB9)\` as a \`Specialized Skill\`
* Added \`"Powder Dosing" (ES1FA9BC6320393AA26E)\` as a \`Specialized Skill\`
* Added \`"Product Registration" (ES946323A882DFCB7518)\` as a \`Specialized Skill\`
* Added \`"Protein Denaturation" (ESF4F7E73EDDC501F67B)\` as a \`Specialized Skill\`
* Added \`"Remote Access Support" (ES776ABC2D92A0CC07DF)\` as a \`Specialized Skill\`
* Added \`"Results-Driven Approach" (ES3C44B919B5FF6F5B6E)\` as a \`Common Skill\`
* Added \`"Shelf Life" (ESA217F144D0FAFCA315)\` as a \`Specialized Skill\`
* Added \`"Social Selling" (ES3ACE9B2480B4307BFB)\` as a \`Specialized Skill\`
* Added \`"Spray Drying" (ESAD13246B11ED823737)\` as a \`Specialized Skill\`
* Added \`"Sterility Performance" (ES20915E2BE5D08460A5)\` as a \`Specialized Skill\`
* Added \`"Thermal Processing" (ES71639C3A4D6CAD16C7)\` as a \`Specialized Skill\`
* Added \`"Vacuum Dissolving" (ES32ED33ADEFB580EC67)\` as a \`Specialized Skill\`
* Added \`"Vacuum Drying" (ESDC92371044E4BE8AB2)\` as a \`Specialized Skill\`
* Added \`"Values Differences" (ESEE44704D49C0AE1AAE)\` as a \`Common Skill\`
* Added \`"Water Activity" (ESE29A541322790A5353)\` as a \`Specialized Skill\`
* Added \`"Wet Cleaning" (ES50A2FF73B30EA621EB)\` as a \`Specialized Skill\`
* Restored \`"Dust Explosion" (KS1237P6X2050ZS78KJY)\` as a \`Specialized Skill\`
* Restored \`"Water Content" (KS126NW6B0KWL4YFD8LQ)\` as a \`Specialized Skill\`

</div>

### Removed

<div class="tabs">
<div data-tab="Removals (1)">

* Removed skill \`"Financial Accounting Standards Board (FASB) Certified" (KS123TR71TTMPVJ1SY7H)\`

</div>


</div>

<div class="internal-only">

### Internal Only
<div data-toggle="All 111 Changes">

* Blacklisted \`DO YOU HAVE EXPERIENCE IN SAS\`
* Blacklisted \`ACHIEVE GREATNESS FOR SAS\`
* Blacklisted \`BELIEVE THAT SAS ARE THE BEST\`
* Blacklisted \`SAS ITEMS\`
* Blacklisted \`SAS PHILOSOPHY\`
* Blacklisted \`CQSW, CSS\`
* Blacklisted \`CQSW, DIP SW,CSS\`
* Blacklisted \`COMPLY WITH NNSA SECURITY REQUIREMENTS FOR MEDPEDS\`
* Blacklisted \`COMPLIANCE WITH NNSA SECURITY REQUIREMENTS PRIOR TO THE INTERVIEW DATE\`
* Blacklisted \`POSITION: R\`
* Blacklisted \`IF YOU HAVE A MEDICAL PORTABLE ELECTRONIC DEVICE (MEDPED), SUCH ASA PACEMAKER, DEFIBRILLATOR\`
* Blacklisted \`REPRESENT SAS\`
* Blacklisted \`FAMILIARITY WITH DIGITAL R D\`
* Blacklisted \`MATERIALS R D\`
* Blacklisted \`ROADMAP FOR R D\`
* Blacklisted \`WITH R D\`
* Blacklisted \`SUPPORT R D\`
* Blacklisted \`WITH OUR R D\`
* Blacklisted \`CONTRIBUTE TO R D\`
* Blacklisted \`WITHIN THE R D\`
* Blacklisted \`WORK WITH THE R D\`
* Blacklisted \`R D\`
* Blacklisted \`WE HAVE ADDED A DISCLAIMER TO OUR APPLICATION PROCESS ADVISING THAT THE USE OF AI IS MONITORED\`
* Blacklisted \`THE USE OF AI TOOLS IN COMPLETING APPLICATIONS IS MONITORED TO ENSURE TRANSPARENCY AND FAIRNESS\`
* Blacklisted \`IF YOU HAVE A MEDICAL PORTABLE ELECTRONIC DEVICE (MEDPED), SUCH AS A PACEMAKER, DEFIBRILLATOR\`
* Blacklisted \`SAS IS A CUSTOMER FOCUSED ORGANIZATION\`
* Blacklisted \`BETWEEN SAS\`
* Blacklisted \`CANDIDATE AI USAGE POLICY\`
* Blacklisted \`WE OFFER A NUMBER OF ACCOMMODATIONS TO COMPLETE OUR INTERVIEW PROCESS INCLUDING SCREEN READERS, SIGN LANGUAGE INTERPRETERS\`
* Blacklisted \`WEOFFER A NUMBER OF ACCOMMODATIONS TO COMPLETE OUR INTERVIEW PROCESSINCLUDING SCREEN READERS\`
* Blacklisted \`OFFRIAMO DIVERSI ACCOMODAMENTI PER PORTARE A TERMINE I NOSTRI COLLOQUI E, TRA QUESTI, SCREEN READERS\`
* Blacklisted \`WE OFFER A NUMBER OF ACCOMMODATIONS TO COMPLETE OUR INTERVIEW PROCESS INCLUDING SCREEN READER, SIGN LANGUAGE INTERPRETERS\`
* Blacklisted \`WEOFFER A NUMBER OF ACCOMMODATIONS TO COMPLETE OUR INTERVIEW PROCESSINCLUDING SCREEN READER\`
* Blacklisted \`OFFRIAMO DIVERSI ACCOMODAMENTI PER PORTARE A TERMINE I NOSTRI COLLOQUI E, TRA QUESTI, SCREEN READER\`
* Blacklisted \`CPT / OPT\`
* Blacklisted \`STUDENT VISA STATUS IS ACCEPTED WITH CPT\`
* Blacklisted \`SOA0\`
* Blacklisted \`HEALTHCARE TECHNOLOGY MANAGEMENT PROGRAMS. ACI CERTIFICATION\`
* Blacklisted \`ACI CERTIFICATION FOR THE BIOMEDICAL EQUIPMENT\`
* Blacklisted \`ACI CERTIFICATION THROUGH AAMI SKILLS\`
* Blacklisted \`CPT 或 OPT\`
* Blacklisted \`(AAMI) CREDENTIALS INSTITUTE (ACI) CERTIFIED\`
* Blacklisted \`CPT & OPT\`
* Blacklisted \`AAMI CREDENTIALS INSTITUTE (ACI) CERTIFICATION\`
* Blacklisted \`OPT OR CPT\`
* Blacklisted \`CPT/OPT/STEM\`
* Blacklisted \`BIOMEDICAL FIELDS PREFERRED OR ACI CERTIFICATION\`
* Blacklisted \`MODERATE NOISE (EXAMPLES: BUSINESS OFFICE WITH TYPEWRITERS AND/OR COMPUTER PRINTERS, LIGHT TRAFFIC)\`
* Blacklisted \`AAMI ACI CERTIFIED\`
* Blacklisted \`AAMI ACI CERTIFICATION\`
* Blacklisted \`SAS CUSTOMER\`
* Blacklisted \`AI-GENERATED ANSWERS OFTEN LACK THE REAL LIFE EXAMPLES\`
* Blacklisted \`RELYING TOO HEAVILY ON GENERIC, AI-GENERATED CONTENT INSTEAD OF DRAWING FROM YOUR OWN STRENGTHS AND ACCOMPLISHMENTS MAY LEAD TO YOUR APPLICATION BEING REJECTED\`
* Blacklisted \`DIP SW OR CSS\`
* Blacklisted \`DIP SW,CSS\`
* Blacklisted \`PLEASE BE ADVISED THAT THE USE OF AI IN APPLICATIONS ARE MONITORED\`
* Blacklisted \`USE OF AI: PLEASE NOTE THAT THE USE OF AI FOR WRITING SUPPORTING STATEMENTS IS NOT PERMITTED\`
* Blacklisted \`FAA CERTIFICATION PROCESS EXPERIENCE\`
* Blacklisted \`FAA CERTIFICATION PROCESS\`
* Blacklisted \`USE AI TOOLS DURING REAL-TIME INTERVIEWS\`
* Blacklisted \`LLAMA HOY\`
* Blacklisted \`LLAMA AL\`
* Blacklisted \`O LLAMA\`
* Blacklisted \`00 LLAMA\`
* Blacklisted \`WHATSAPP O LLAMA\`
* Blacklisted \`INFORMACIÓN LLAMA\`
* Blacklisted \`ENTREVISTA LLAMA\`
* Blacklisted \`LLAMA EL\`
* Blacklisted \`LLAMA O\`
* Blacklisted \`LLAMA A LOS INVITADOS\`
* Blacklisted \`FAVOR APPLICAN O LLAMA\`
* Blacklisted \`LLAMA O ENVÍA\`
* Blacklisted \`QUE LLAMA\`
* Blacklisted \`LLAMA Y\`
* Blacklisted \`INFORMACION LLAMA\`
* Blacklisted \`FAA CERTIFICATION PROCESSES\`
* Blacklisted \`CQSW OR CSS\`
* Blacklisted \`CSS, CQSW\`
* Blacklisted \`CSS DIPSW\`
* Blacklisted \`CSS-FJUV6G\`
* Blacklisted \`USE OF ARTIFICIAL INTELLIGENCE (AI) WHEN WRITING JOB APPLICATIONS\`
* Blacklisted \`EBT TRAINEE DRIVER\`
* Blacklisted \`ACTING AS AMBASSADORS FOR EBT\`
* Blacklisted \`EDINBURGH BUS TOURS (EBT)\`
* Blacklisted \`WE USE THE ARTIFICIAL INTELLIGENCE ('AI') PLATFORM,HIREDSCORE TO IMPROVE YOUR JOB APPLICATION EXPERIENCE\`
* Blacklisted \`AI FULL JOB DESCRIPTION\`
* Blacklisted \`WE FULLY SUPPORT THE USE OF AI AND OTHER TOOLS TO ASSIST IN WRITING YOUR APPLICATION\`
* Blacklisted \`WE ARE AWARE THAT ARTIFICIAL INTELLIGENCE (AI) TECHNOLOGY IS INCREASINGLY BEING USED TO GENERATE RESPONSES FOR APPLICATION FORMS\`
* Blacklisted \`IF ARTIFICIAL INTELLIGENCE (AI) PROGRAMMES ARE USED THEN THE APPLICATION MAY BE REJECTED\`
* Blacklisted \`THE USE OF ARTIFICIAL INTELLIGENCE (AI), AUTOMATED TOOLS, OR OTHER THIRD-PARTY ASSISTANCE TO GENERATE\`
* Blacklisted \`CUTTING-EDGE AI, DATA, AND AUTOMATION\`
* Blacklisted \`WE ARE AWARE THAT AN INCREASING NUMBER OF APPLICANTS ARE USING AI TECHNOLOGY TO GENERATE RESPONSES ON NHS JOB APPLICATION FORMS\`
* Blacklisted \`IF YOU ARE USING AI TO ENHANCE YOUR APPLICATION, PLEASE DISCLOSE THIS IN YOUR NHS JOBS APPLICATION FORM.\`
* Blacklisted \`USE OF AI APPLICATIONS FOR THIS ROLE SHOULD BE WRITTEN BY THE APPLICANT\`
* Blacklisted \`PLEASE SEE ATTACHED DOCUMENT REGARDING ACCEPTABLE USE OF AI DURING THE RECRUITMENT PROCESS\`
* Blacklisted \`WE ARE AWARE THAT SOME CANDIDATES MAY CHOOSE TO USE AI TOOLS TO SUPPORT THEIR APPLICATION\`
* Blacklisted \`AMBASSADOR FOR EBT SELLING TICKETS\`
* Blacklisted \`MUST TAKE CARE TO ENSURE THE USE OF AI TOOLS DOES NOT GENERATE AN APPLICATION\`
* Blacklisted \`AI-GENERATED CONTENT DOES NOT FULLY GRASP THE CONTEXT AND REQUIREMENTS OF THE JOB\`
* Blacklisted \`WE UNDERSTAND THE SUPPORT THAT GENERATIVE ARTIFICIAL INTELLIGENCE (AI) SOFTWARE CAN OFFER BUT IT CAN ALSO LEAD TO NUMEROUS APPLICATIONS PRESENTING AS GENERIC AND IMPERSONAL\`
* Blacklisted \`ACCEPTABLE USE OF AI: AT BATTERSEA, WE VALUE EXPERTISE\`
* Blacklisted \`WE ENCOURAGE YOU TO WRITE YOUR RESPONSES WITHOUT THE ASSISTANCE OF AI\`
* Blacklisted \`IF YOU REQUIRE THE USE OF AI SOFTWARE TO AID IN COMPLETING YOUR APPLICATION\`
* Blacklisted \`PLEASE NOTE THAT THE USE OF AI IS MONITORED AND IF USED IN YOUR APPLICATION MUST BE DECLARED\`
* Blacklisted \`WE ASK THAT YOU FOLLOW THE BELOW GUIDELINES ON THE USE OF AI AT INTERVIEW STAGES\`
* Blacklisted \`PRACTICING INTERVIEW QUESTIONS WITH AI TOOLS TO IMPROVE COMMUNICATION SKILLS\`
* Blacklisted \`USING AI TO SUPPORT WITH STRUCTURING YOUR RESPONSES\`
* Blacklisted \`SUBMIT AI-GENERATED RESPONSES AS YOUR OWN DURING THE INTERVIEW\`
* Blacklisted \`USE AI TO IMPERSONATE OR MISREPRESENT YOUR EXPERIENCE OR SKILLS\`
* Blacklisted \`THE USE OF AI IN COMPLETING APPLICATIONS SHOULD BE DECLARED\`
* Blacklisted \`CONTRIBUTES TO THE EBT TEAM\`

</div>


</div>


</div>
`

const SCHEMA_NAME = 'lightcast'
const DIR_NAME = '.lightcast'

describe('lightcast', () => {
  let db: Kysely<IntelligenceDatabase>
  let openai: OpenAI
  let agent: MockAgent

  before(async () => {
    db = new Kysely<IntelligenceDatabase>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.POSTGRES_CONNECTION_STRING_TEST,
        }),
      }),
    })
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.schema.createSchema(SCHEMA_NAME).ifNotExists().execute()
    db = db.withSchema(SCHEMA_NAME)
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(
          cwd(),
          '../database/src/intelligence/migrations',
        ),
      }),
      migrationTableSchema: SCHEMA_NAME,
    })
    const { error } = await migrator.migrateToLatest()

    if (error) {
      console.error('failed to migrate')
      console.error(error)
      process.exit(1)
    }

    openai = new OpenAI({ apiKey: '' })
    mock.property(openai, 'embeddings', {
      create: (options: { model: string; input: string[] }) => ({
        data: options.input.map((_, i) => ({
          embedding: Array(1536).fill(0),
          index: i,
          object: 'embedding',
        })),
      }),
    } as any)
  })

  after(async () => {
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.destroy()
  })

  beforeEach(async () => {
    await mkdir(DIR_NAME)
    agent = new MockAgent()
    setGlobalDispatcher(agent)
  })

  afterEach(async () => {
    await db.deleteFrom('tag_template').execute()
    await rm(DIR_NAME, { recursive: true })
  })

  it('process incrementally throws when file is not downloaded', async () => {
    assert.rejects(
      async () =>
        await processSkillsIncrementally(
          {
            s3: new S3Client({
              endpoint: '',
              accessKeyId: '',
              secretAccessKey: '',
            }),
            db,
            openai,
          },
          { type: 'fs', directory: DIR_NAME },
        ),
      { name: 'Error', message: 'Skills were never downloaded before' },
    )
  })

  it('process incrementally throws when file is not processed', async () => {
    await mkdir(path.resolve(DIR_NAME, 'lightcast'))
    const filename = path.resolve(DIR_NAME, 'lightcast/skills.json')
    await writeFile(filename, JSON.stringify(skills))

    assert.rejects(
      async () =>
        await processSkillsIncrementally(
          {
            s3: new S3Client({
              endpoint: '',
              accessKeyId: '',
              secretAccessKey: '',
            }),
            db,
            openai,
          },
          { type: 'fs', directory: DIR_NAME },
        ),
      { name: 'Error', message: 'Skills were never processed before' },
    )

    await rm(filename)
  })

  it('process incrementally skips', async () => {
    agent
      .get('https://lightcast.io')
      .intercept({
        path: '/api/skills/skill-categories',
        method: 'GET',
      })
      .reply(200, skills)
    await mkdir(path.resolve(DIR_NAME, 'lightcast'))
    const filename = path.resolve(DIR_NAME, 'lightcast/skills.json')
    await writeFile(
      filename,
      JSON.stringify({
        name: skills.name,
        children: skills.children.map(c => ({
          name: c.name,
          children: c.children.map(cc => ({
            name: cc.name,
            children: cc.children.map(ccc => ({
              id: ccc.id,
              name: ccc.name,
              embedding: Array(1536).fill(0),
            })),
          })),
        })),
        embedded: true,
      }),
    )

    const updated = await processSkillsIncrementally(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
        openai,
      },
      { type: 'fs', directory: DIR_NAME },
    )
    assert.ok(!updated)
    await rm(filename)
  })

  it('process incrementally', async () => {
    agent
      .get('https://lightcast.io')
      .intercept({
        path: '/api/skills/skill-categories',
        method: 'GET',
      })
      .reply(200, skills)

    agent
      .get('https://emsiservices.com')
      .intercept({
        path: '/docs-site-proxy',
        query: {
          url: 'https://emsiservices.com/skills/docs/data-changelog',
        },
        method: 'GET',
      })
      .reply(200, delta)

    await processSkillsCompletely(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
        openai,
      },
      { type: 'fs', directory: DIR_NAME },
    )

    agent
      .get('https://lightcast.io')
      .intercept({
        path: '/api/skills/skill-categories',
        method: 'GET',
      })
      .reply(200, skills2)
    await processSkillsIncrementally(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
        openai,
      },
      { type: 'fs', directory: DIR_NAME },
    )

    const tags = await db.selectFrom('tag_template').selectAll().execute()
    assert.equal(tags.filter(t => t.deprecated_at).length, 2)
    assert.ok(
      tags
        .filter(t => t.deprecated_at)
        .map(t => t.name)
        .includes('.NET Framework 1'),
    )
    assert.ok(
      tags
        .filter(t => t.deprecated_at)
        .map(t => t.name)
        .includes('.NET Framework 4'),
    )
    const ids = new Set(
      tags.map(t => (t.metadata as SkillTagMetadata).external_id),
    )
    const names = new Set(tags.map(t => t.name))
    assert.ok(
      skills2.children[0].children[0].children
        .map(c => c.id)
        .every(id => ids.has(id)),
    )
    assert.ok(
      skills2.children[0].children[0].children
        .map(c => c.name)
        .every(name => names.has(name)),
    )

    const filename = path.resolve(DIR_NAME, 'lightcast/skills.json')
    const content = await readFile(filename, 'utf-8')
    const parsed = JSON.parse(content) as LightcastSkills
    assert.ok(parsed.children[0].children[0].children.every(c => c.embedding))
    assert.ok(parsed.embedded)
  })

  it('processes completely', async () => {
    agent
      .get('https://lightcast.io')
      .intercept({
        path: '/api/skills/skill-categories',
        method: 'GET',
      })
      .reply(200, skills)

    await processSkillsCompletely(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
        openai,
      },
      { type: 'fs', directory: DIR_NAME },
    )

    const tags = await db.selectFrom('tag_template').selectAll().execute()
    assert.equal(tags.length, skills.children[0].children[0].children.length)
    assert.ok(
      tags.every(
        t =>
          t.metadata.namespace === 'skill' &&
          t.metadata.category === skills.children[0].name &&
          t.metadata.sub_category === skills.children[0].children[0].name,
      ),
    )

    const filename = path.resolve(DIR_NAME, 'lightcast/skills.json')
    const content = await readFile(filename, 'utf-8')
    const parsed = JSON.parse(content) as LightcastSkills
    assert.ok(parsed.children[0].children[0].children.every(c => c.embedding))
    assert.ok(parsed.embedded)
  })
})
