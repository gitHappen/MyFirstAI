# Adding your discoveries

The website reads three JSON arrays. Keep unknown dates and scientific names as `null`; never fill gaps with invented observations. Keep IDs unique and preserve links when renaming a record.

## Animal records: `data/animals.json`
Edit a candidate record or copy this structure into the array:
```json
{
  "id": "your-unique-id",
  "commonName": "Your animal group",
  "scientificName": null,
  "taxonomicGroup": "Unconfirmed",
  "identificationConfidence": "unverified",
  "status": "awaiting-field-notes",
  "habitats": [],
  "observedTraits": [],
  "observedBehaviors": [],
  "photoPaths": [],
  "journalEntryIds": [],
  "researchQuestions": [],
  "sources": []
}
```
Use strings in the habitat, trait, behavior, and question arrays. Only list traits and behaviors you directly documented. When supporting notes have been added, change the status to `documented`; identification confidence still needs an honest separate assessment. Scientific names should be no more specific than the evidence supports.

Photo entries can be paths or objects: `{"path":"assets/images/wildlife/your-photo.jpg","alt":"Describe what this actual photo shows; include credit if needed"}`. Supply your own images and descriptive alt text. Do not rename a placeholder into evidence. Remove location metadata from photos before uploading.

Sources use `{"title":"Author / work / publication date / accessed date","url":"https://example.org/source"}`. Optional animal fields: `diet` with `summary`, `evidence`, and `sources`; string arrays `adaptations` and `ecologicalRole`. For adaptations and roles, explicitly prefix each statement with its evidence label and cite the relevant source. Diet-specific citations should also appear in the main `sources` array so visitors can read them.

## Field journal: `data/journal.json`
```json
{
  "id": "journal-0001",
  "date": null,
  "title": "Title of your actual field note",
  "animal_ids": [],
  "habitat": "",
  "time_of_day": "",
  "conditions": "",
  "observation": "",
  "photos": [],
  "questions": [],
  "interpretation": "",
  "follow_up": "",
  "source_note": ""
}
```
This is an empty template, not an observation. Use `YYYY-MM-DD` only when the date is known. `animal_ids` links to animal IDs and enables profile-to-journal references. Photo objects use the same format as animal photos. Keep interpretation separate from observation. Use a general habitat, never a home address.

## Research: `data/investigations.json`
Each investigation can contain `id`, `title`, `status`, `question`, `background`, `hypothesis`, `method`, `variables`, `data`, `analysis`, `results`, `limitations`, `conclusion`, and `nextSteps`. Use text for all except `data`, which is an array of raw measurement objects. Only add a hypothesis if it was actually proposed. Missing fields stay absent; planned work must be labeled `planned`. Raw data displays directly, without invented charts or conclusions.

## Preview and publish
1. Validate all JSON (see README). Trailing commas are invalid.
2. Start the local HTTP server and inspect the relevant animal, links, and journal entry.
3. Check image credits, citations, dates, and evidence labels.
4. Commit and push your edits. GitHub Pages will update if enabled for that branch.

Editing JSON is the current content-entry workflow. There is no browser-based editor, account system, or automatic upload service.
