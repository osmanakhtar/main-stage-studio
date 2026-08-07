# SOP-MSS-002: Producing an MSS brand film through Higgsfield

| | |
|---|---|
| **Purpose** | Turn one approved brand-film concept into a posted 9:16 film, on palette, with no fabricated people and no generated type |
| **Operator** | Osman |
| **Verified** | 2026-08-07 (films 1 and 5 produced end to end as written) |
| **Systems touched** | Higgsfield MCP (Seedream 4.5, Kling v3.0), ffmpeg, local scratchpad, `01_mss/marketing/assets/brand-films/` |
| **Canon doc** | `01_mss/marketing/mss-brand-film-concepts.md` (concepts, binding production rules §7, learnings) |

## When this runs

When a film from the concepts doc is approved for production. One film per session. Do not batch several films: the defect-check step is the whole value and it does not survive being rushed.

## Prerequisites

- Higgsfield MCP connected, Plus plan with credits available (check with `balance`; a four-shot film costs roughly 12 to 20 generations including reshoots).
- The film's shot list open from `mss-brand-film-concepts.md` §4.
- Production rules §7 read. They are binding, not advisory.
- ffmpeg installed (`which ffmpeg`).
- A scratchpad directory for working files. Never work directly in the repo.

## Routine operation

### Stage 1: still frames

1. Write one prompt per shot. Every prompt must name the palette explicitly (parchment `#F5EFE5`, blush `#E8C9AE`, terracotta `#BF6B47`, ember `#8C4A2F`, near-black `#1C1712`) and must end with the negative list: no people, no text, no logos, no lens flare, no blue or teal grade.
2. Submit all shots in one `generate_image_batch` call, `model: seedream_v4_5`, `aspect_ratio: "9:16"`, `use_unlim: false`.
3. `jobs_wait` until terminal.
4. **Download every frame and look at it.** Do not skip this and do not judge from thumbnails.
   ```
   curl -s -o shot1.png <result_url>
   ```
   Then open each one.
5. Reject on any of: sun in frame or lens flare, blue or cyan anywhere, generated legible text or UI, a visible face or body above the wrist, more than one accent colour, a golden-hour or teal-orange grade.
6. Reshoot rejects with the specific fault named as a negative. **If a shot fails twice in opposite directions, change the shot, not the prompt.** A different composition that carries the same meaning beats a third guess.

### Stage 2: motion

7. For any shot whose point is a change of state (closing, opening, filling, striking), generate an **end frame** first: pass the start frame's `job_id` in the `image_references` role and describe the changed state forcefully. Verify start against end side by side before animating:
   ```
   ffmpeg -y -i start.png -i end.png -filter_complex "[0:v]scale=400:-1[a];[1:v]scale=400:-1[b];[a][b]hstack" -update 1 CMP.png
   ```
   If the end frame is a near copy of the start, the reference role has overridden the instruction. Go to step 6.
8. Submit motion with `generate_video_batch`, `model: kling3_0`, `aspect_ratio: "9:16"`, `duration: 5`, `sound: "off"`, `use_unlim: false`, and `declined_preset_id: "24bae836-2c4a-48e0-89b6-49fcc0b21612"`. Without the declined preset, submissions fail with a preset recommendation instead of running.
9. `mode: "pro"` for shots with real physics (water, fire, fabric). `mode: "std"` for near-static interiors.
10. Pass the start frame in `start_image`, and the end frame in `end_image` where step 7 applied.

### Stage 3: defect check on motion

11. Download every clip and build a contact sheet per clip:
    ```
    N=$(ffprobe -loglevel error -show_entries stream=nb_frames -of csv=p=0 clip.mp4 | head -1)
    ffmpeg -loglevel error -y -i clip.mp4 \
      -vf "select='eq(n\,0)+eq(n\,$((N/3)))+eq(n\,$((2*N/3)))+eq(n\,$((N-2)))',scale=340:-1,tile=4x1" \
      -frames:v 1 -update 1 sheet.png
    ```
12. Look at each sheet and ask one question: **did the shot's beat actually happen?** A clip that is beautiful and did not do the thing is a failed clip. Expect a slow camera drift regardless of instructions; that is acceptable. A missing state change is not.
13. Reshoot failures via step 7.

### Stage 4: assemble

14. Cut with straight cuts, no crossfades, fade in from black 0.6s and out to black 1.0s. Normalise everything to 1080x1920.
15. Output picture only, silent, `-crf 18`. Type, end card, grade and score are post steps, listed per film in the concepts doc §10.
16. Copy the rough cut, the source clips and the approved start and end frames into `01_mss/marketing/assets/brand-films/`. Keeping the frames is what makes a re-cut cheap later.

## Checks

- Every clip is 1080x1920 (or 720x1280 for std mode) at 24fps: `ffprobe -show_entries stream=width,height,r_frame_rate`.
- No frame anywhere contains a face, a readable word, or a blue or cyan pixel of any size.
- Played with sound off on a phone, each film's meaning is legible without type.
- `balance` after the session, against the estimate in Prerequisites.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Video submission returns `submission_failed` with a preset name | Preset interception | Resubmit with `declined_preset_id` set to the returned preset id |
| Gates, doors, water level etc. do not change across the clip | Prompted action, no end frame | Generate an end frame and pass it in `end_image` (step 7) |
| End frame comes back as a copy of the start frame | `image_references` overriding the instruction | Works for shape changes, fails for quantity changes. Change the shot (step 6) |
| Colours drift to teal and orange | Text-to-video, or palette not named | Always generate a still first, name the hex values, then image-to-video |
| Legible but wrong text appears on screen | Type was generated instead of composited | Regenerate the plate blank and defocused, set type in post |
| Clip has a slow push-in despite locked-off instruction | Kling default behaviour | Accept it, or stabilise in post. Do not re-roll for it |
| A shot fails three times | The shot is wrong, not the prompt | Replace it with a different composition carrying the same meaning |

Escalation: if a film's central beat cannot be produced after a shot change, stop and take it back to the concepts doc. A film missing its mechanism is not worth posting, and that is a creative decision, not a production one.

## Boundaries

- **Never generate a person presented as a client, a colleague, or the founder.** Hands and empty rooms only. This is the studio's largest reputational exposure and it is not negotiable for any film.
- **Never generate legible type.** All copy is set in post in Cormorant Garamond and Plus Jakarta Sans.
- **Never depict an identifiable real firm**, its site, its branding, or its documents.
- **Never publish a film making a claim the studio cannot support**: no client counts, no auto-publish claim, no employer named, no invented figures.
- Nothing posts without founder sign-off on the finished cut, not the rough.
- Compliance examples used inside a film (film 3, One Word) must be verified against the actual rule text before that film is produced at all.

## Change log

- 2026-08-07: created, after producing The Lock and The Safest Thing end to end.
