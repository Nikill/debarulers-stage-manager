# Debarulers — Stage Click, prototype v0.1

A Max for Live panel for driving the scenes of your Ableton set: big song name and BPM, clickable setlist, previous, next, restart and stop.

**Shipped as a source .maxpat patch + JavaScript. It is not a compiled .amxd yet.** The conversion happens in the Max editor opened from Ableton, following the steps below. Target: Live 11/12 with Max for Live (Max 8 or later). The logic was checked by simulation and the patch wiring verified; behaviour and rendering inside Live/Max still need to be validated on your Mac.

## One-time install

1. Unzip the folder and keep it somewhere permanent, e.g. Documents/Debarulers-Stage-Click. Keep `stage_click.js` next to the future `.amxd` file.
2. In your Ableton set, drop an empty **Max MIDI Effect** directly on the MIDI track that plays the click, **before the Drum Rack/instrument and outside any Rack**. The device passes MIDI through unchanged. Only one instance is needed.
3. Click the device's edit button to open Max. In Max: File > Open, pick `Stage-Click.maxpat`. Switch to Patching mode if presentation hides the objects, unlock the patch (`Cmd + E`), then select all and copy (`Cmd + A`, `Cmd + C`).
4. Go back to the empty Max MIDI Effect window opened from Live. Switch to Patching mode, unlock, select and delete its objects, then paste. The supplied patch already contains `midiin`, `midiout` and `live.thisdevice`.
5. Save this **Max for Live device** with Save As, as `Debarulers-Stage-Click.amxd`, **in the same folder as `stage_click.js`**. Close the editor. Reload the saved device on the click track so the API and script lookup initialise. Do not just rename the `.maxpat` to `.amxd`.
6. Click **OPEN PANEL**. If needed, click REFRESH. The floating window shows the tracked track name at the bottom. Save the Ableton set.

Once validated, you can freeze the device from Max to embed its dependencies. Until it is frozen, keep the `.js` next to the `.amxd` and share both files together.

## Preparing the set

- Keep your existing click track and looped MIDI clips.
- One scene per song, with its name and its BPM enabled in the scene settings.
- A scene with no clip on the click track is shown, but launching it from the panel is refused.
- Disable Follow Actions on clips and scenes to keep transitions manual.
- Set clips to Trigger mode, Loop on and Legato off so they restart from the beginning.
- The panel respects Live's and the clips' launch quantization. During playback a launch may wait for the next bar; the screen shows PENDING. It does not impose a different quantization.
- Do not arm other tracks; a scene launch fires all its clips, just like Live's scene button. The device targets your click set, not a recording session.
- Audio routing stays as set up: pick the audio interface and output feeding the in-ears. The panel does not generate sound and changes neither volumes nor routing.

## Usage

| Control | Result |
|---|---|
| START / RESTART | Launches the current scene, including after a stop. |
| NEXT | Launches the next scene in a single press. |
| PREVIOUS | Launches the previous scene in a single press. |
| STOP | Immediately stops all Session clips, cancels pending launches and stops the global transport. |
| Click a title | Launches that scene directly. |
| PAGE - / PAGE + | Shows other titles without changing playback. |
| REFRESH | Rescans scenes, or retries the connection after install. |

For the first song, click its title or use START if the right song is already shown. The device never starts anything on load.

The panel follows the `playing_slot_index` of its host track: if you launch a scene from Live, its title becomes the current song. When stopped, it keeps the last song so NEXT still works. Live's automatic selection of the next scene therefore does not shift the panel.

At the ends of the list, previous/next do not wrap. A 400 ms guard limits double presses. While a launch is pending, other launches are ignored; STOP cancels it.

The BPM shown during playback is Live's; when stopped, it is the scene's configured tempo. GLOBAL means the scene has no active tempo and inherits the global tempo. Set its tempo in Ableton to get the song's own BPM.

## Validation in Live before a gig

1. Launch the first song: check the click and its BPM.
2. STOP then NEXT: the second song must start at its tempo with no extra action.
3. Test PREVIOUS, START and clicking a title directly.
4. Launch a song directly from Live's grid: the panel must follow it.
5. Check STOP during a quantized launch, and the first/last song limits.
6. Save, close and reopen the set: no click must start on open; the panel must reconnect.

If the panel stays empty, open the Max console and check that `stage_click.js` was found. If the message asks for a MIDI track, move the device directly onto the click track, outside any Rack. Once the device is saved in the right place, remove it and load it again.

## Technical references

- Scene API: https://docs.cycling74.com/apiref/lom/scene/
- Transport and stop: https://docs.cycling74.com/apiref/lom/song/
- Track and playing_slot_index: https://docs.cycling74.com/apiref/lom/track/
- Max for Live interfaces: https://docs.cycling74.com/userguide/m4l/live_userinterfaces/

The supplied tests use a simulated API. They do not replace audio, visual and integration validation in Ableton.
