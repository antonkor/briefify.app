# Log Command

Create a log entry in /logs/<mm-dd-yy>.md with:

1. Extract the last 3-5 user prompts from this conversation
2. For each prompt, include:
   - User message with light corrections (fix obvious spelling errors and minor grammar issues only - preserve original meaning and tone)
   - Brief summary of Claude's response (1-2 sentences)
   - Any key actions taken (files created/edited, commands run, etc.)
   - Model name under each prompt

3. Format as markdown with clear sections:
   ```markdown
   # Chat Log - [Date]

   ## Prompt Timeline (Fast Scanning)
   - User: [brief prompt summary]
   - User: [brief prompt summary]
   - User: [brief prompt summary]

   ## Detailed Prompts

   ## Prompt 1
   **User:** [prompt text with light spelling/grammar corrections]
   **Model:** [claude model name and version]
   **Claude Response:** [brief summary]
   **Actions:** [key actions taken]

   ## Prompt 2
   ...
   ```

4. Append to existing log file if it exists for today, otherwise create new file
5. Ensure logs directory exists in current project root
6. Use current date automatically (format: mm-dd-yy based on today's date)

## Correction Guidelines:
- Fix obvious spelling errors (e.g., "buiness" → "business", "sectin" → "section")
- Correct basic grammar mistakes (missing articles, verb tense consistency)
- Preserve original tone, style, and technical terminology
- Do NOT rewrite or restructure sentences
- Do NOT change slang, casual language, or personal voice
- Keep corrections minimal and obvious only