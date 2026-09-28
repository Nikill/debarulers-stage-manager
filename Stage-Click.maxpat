{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 5,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      100,
      100,
      650,
      420
    ],
    "openinpresentation": 1,
    "default_fontsize": 14.0,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "bgcolor": [
      0.055,
      0.065,
      0.085,
      1
    ],
    "boxes": [
      {
        "box": {
          "id": "mi",
          "maxclass": "newobj",
          "patching_rect": [
            30,
            250,
            50,
            22
          ],
          "text": "midiin"
        }
      },
      {
        "box": {
          "id": "mo",
          "maxclass": "newobj",
          "patching_rect": [
            30,
            330,
            55,
            22
          ],
          "text": "midiout"
        }
      },
      {
        "box": {
          "id": "live",
          "maxclass": "newobj",
          "patching_rect": [
            140,
            250,
            100,
            22
          ],
          "text": "live.thisdevice"
        }
      },
      {
        "box": {
          "id": "defer",
          "maxclass": "newobj",
          "patching_rect": [
            140,
            285,
            65,
            22
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "init",
          "maxclass": "message",
          "patching_rect": [
            140,
            320,
            45,
            22
          ],
          "text": "init"
        }
      },
      {
        "box": {
          "id": "stage",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            330,
            150,
            22
          ],
          "text": "p Stage_Click",
          "patcher": {
            "fileversion": 1,
            "appversion": {
              "major": 8,
              "minor": 5,
              "revision": 0,
              "architecture": "x64",
              "modernui": 1
            },
            "classnamespace": "box",
            "rect": [
              100,
              100,
              1060,
              760
            ],
            "openinpresentation": 1,
            "default_fontsize": 14.0,
            "default_fontface": 0,
            "default_fontname": "Arial",
            "bgcolor": [
              0.055,
              0.065,
              0.085,
              1
            ],
            "boxes": [
              {
                "box": {
                  "id": "js",
                  "maxclass": "newobj",
                  "patching_rect": [
                    20,
                    810,
                    180,
                    22
                  ],
                  "text": "js stage_click.js"
                }
              },
              {
                "box": {
                  "id": "in",
                  "maxclass": "inlet",
                  "patching_rect": [
                    20,
                    770,
                    30,
                    30
                  ]
                }
              },
              {
                "box": {
                  "id": "win",
                  "maxclass": "newobj",
                  "patching_rect": [
                    300,
                    810,
                    80,
                    22
                  ],
                  "text": "thispatcher"
                }
              },
              {
                "box": {
                  "id": "setup",
                  "maxclass": "message",
                  "patching_rect": [
                    300,
                    770,
                    600,
                    22
                  ],
                  "text": "window size 80 80 1140 840, window flags float, window exec, presentation 1"
                }
              },
              {
                "box": {
                  "id": "lb",
                  "maxclass": "newobj",
                  "patching_rect": [
                    300,
                    730,
                    70,
                    22
                  ],
                  "text": "loadbang"
                }
              },
              {
                "box": {
                  "id": "brand",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    18,
                    670,
                    30
                  ],
                  "text": "DEBARULERS  /  STAGE CLICK",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    18,
                    670,
                    30
                  ],
                  "varname": "brand",
                  "fontsize": 19.0,
                  "textcolor": [
                    0.45,
                    0.85,
                    0.74,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "position",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    64,
                    650,
                    28
                  ],
                  "text": "SETLIST",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    64,
                    650,
                    28
                  ],
                  "varname": "position",
                  "fontsize": 16.0,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.97,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "song",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    98,
                    675,
                    96
                  ],
                  "text": "Connect to Ableton",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    98,
                    675,
                    96
                  ],
                  "varname": "song",
                  "fontsize": 40.0,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.97,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "bpmlabel",
                  "maxclass": "comment",
                  "patching_rect": [
                    760,
                    65,
                    230,
                    28
                  ],
                  "text": "BPM",
                  "presentation": 1,
                  "presentation_rect": [
                    760,
                    65,
                    230,
                    28
                  ],
                  "varname": "bpmlabel",
                  "fontsize": 18.0,
                  "textcolor": [
                    0.45,
                    0.85,
                    0.74,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "bpm",
                  "maxclass": "comment",
                  "patching_rect": [
                    755,
                    98,
                    275,
                    105
                  ],
                  "text": "---",
                  "presentation": 1,
                  "presentation_rect": [
                    755,
                    98,
                    275,
                    105
                  ],
                  "varname": "bpm",
                  "fontsize": 62.0,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.97,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "status",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    207,
                    1000,
                    34
                  ],
                  "text": "Loading...",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    207,
                    1000,
                    34
                  ],
                  "varname": "status",
                  "fontsize": 22.0,
                  "textcolor": [
                    0.98,
                    0.72,
                    0.37,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "nexttitle",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    250,
                    1000,
                    30
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    250,
                    1000,
                    30
                  ],
                  "varname": "nexttitle",
                  "fontsize": 19.0,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.97,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "previous",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    28,
                    304,
                    225,
                    76
                  ],
                  "text": "PREVIOUS",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    304,
                    225,
                    76
                  ],
                  "varname": "previous",
                  "mode": 0,
                  "fontsize": 20.0,
                  "bgcolor": [
                    0.16,
                    0.2,
                    0.27,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "previouscmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    325,
                    150,
                    22
                  ],
                  "text": "previous"
                }
              },
              {
                "box": {
                  "id": "stop",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    270,
                    304,
                    225,
                    76
                  ],
                  "text": "STOP",
                  "presentation": 1,
                  "presentation_rect": [
                    270,
                    304,
                    225,
                    76
                  ],
                  "varname": "stop",
                  "mode": 0,
                  "fontsize": 26.0,
                  "bgcolor": [
                    0.59,
                    0.18,
                    0.23,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "stopcmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    375,
                    150,
                    22
                  ],
                  "text": "stop"
                }
              },
              {
                "box": {
                  "id": "start",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    512,
                    304,
                    245,
                    76
                  ],
                  "text": "START / RESTART",
                  "presentation": 1,
                  "presentation_rect": [
                    512,
                    304,
                    245,
                    76
                  ],
                  "varname": "start",
                  "mode": 0,
                  "fontsize": 18.0,
                  "bgcolor": [
                    0.16,
                    0.34,
                    0.33,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "startcmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    425,
                    150,
                    22
                  ],
                  "text": "start"
                }
              },
              {
                "box": {
                  "id": "next",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    774,
                    304,
                    258,
                    76
                  ],
                  "text": "NEXT",
                  "presentation": 1,
                  "presentation_rect": [
                    774,
                    304,
                    258,
                    76
                  ],
                  "varname": "next",
                  "mode": 0,
                  "fontsize": 26.0,
                  "bgcolor": [
                    0.12,
                    0.44,
                    0.36,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "nextcmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    475,
                    150,
                    22
                  ],
                  "text": "next"
                }
              },
              {
                "box": {
                  "id": "page",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    401,
                    650,
                    25
                  ],
                  "text": "SETLIST",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    401,
                    650,
                    25
                  ],
                  "varname": "page",
                  "fontsize": 15.0,
                  "textcolor": [
                    0.91,
                    0.94,
                    0.97,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "pageup",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    804,
                    398,
                    108,
                    28
                  ],
                  "text": "PAGE -",
                  "presentation": 1,
                  "presentation_rect": [
                    804,
                    398,
                    108,
                    28
                  ],
                  "varname": "pageup",
                  "mode": 0,
                  "fontsize": 13.0,
                  "bgcolor": [
                    0.16,
                    0.2,
                    0.27,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "pageupcmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    550,
                    150,
                    22
                  ],
                  "text": "pageup"
                }
              },
              {
                "box": {
                  "id": "pagedown",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    924,
                    398,
                    108,
                    28
                  ],
                  "text": "PAGE +",
                  "presentation": 1,
                  "presentation_rect": [
                    924,
                    398,
                    108,
                    28
                  ],
                  "varname": "pagedown",
                  "mode": 0,
                  "fontsize": 13.0,
                  "bgcolor": [
                    0.16,
                    0.2,
                    0.27,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "pagedowncmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    600,
                    150,
                    22
                  ],
                  "text": "pagedown"
                }
              },
              {
                "box": {
                  "id": "row0",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    28,
                    440,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    440,
                    494,
                    45
                  ],
                  "varname": "row0",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row0cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    650,
                    150,
                    22
                  ],
                  "text": "choose 0"
                }
              },
              {
                "box": {
                  "id": "row1",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    28,
                    493,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    493,
                    494,
                    45
                  ],
                  "varname": "row1",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row1cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    700,
                    150,
                    22
                  ],
                  "text": "choose 1"
                }
              },
              {
                "box": {
                  "id": "row2",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    28,
                    546,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    546,
                    494,
                    45
                  ],
                  "varname": "row2",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row2cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    750,
                    150,
                    22
                  ],
                  "text": "choose 2"
                }
              },
              {
                "box": {
                  "id": "row3",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    28,
                    599,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    599,
                    494,
                    45
                  ],
                  "varname": "row3",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row3cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    800,
                    150,
                    22
                  ],
                  "text": "choose 3"
                }
              },
              {
                "box": {
                  "id": "row4",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    538,
                    440,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    538,
                    440,
                    494,
                    45
                  ],
                  "varname": "row4",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row4cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    850,
                    150,
                    22
                  ],
                  "text": "choose 4"
                }
              },
              {
                "box": {
                  "id": "row5",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    538,
                    493,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    538,
                    493,
                    494,
                    45
                  ],
                  "varname": "row5",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row5cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    900,
                    150,
                    22
                  ],
                  "text": "choose 5"
                }
              },
              {
                "box": {
                  "id": "row6",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    538,
                    546,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    538,
                    546,
                    494,
                    45
                  ],
                  "varname": "row6",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row6cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    950,
                    150,
                    22
                  ],
                  "text": "choose 6"
                }
              },
              {
                "box": {
                  "id": "row7",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    538,
                    599,
                    494,
                    45
                  ],
                  "text": "",
                  "presentation": 1,
                  "presentation_rect": [
                    538,
                    599,
                    494,
                    45
                  ],
                  "varname": "row7",
                  "mode": 0,
                  "fontsize": 16.0,
                  "bgcolor": [
                    0.12,
                    0.15,
                    0.2,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "row7cmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    1000,
                    150,
                    22
                  ],
                  "text": "choose 7"
                }
              },
              {
                "box": {
                  "id": "trackname",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    669,
                    730,
                    24
                  ],
                  "text": "Click track",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    669,
                    730,
                    24
                  ],
                  "varname": "trackname",
                  "fontsize": 14.0,
                  "textcolor": [
                    0.55,
                    0.63,
                    0.71,
                    1
                  ]
                }
              },
              {
                "box": {
                  "id": "refresh",
                  "maxclass": "textbutton",
                  "patching_rect": [
                    830,
                    666,
                    202,
                    30
                  ],
                  "text": "REFRESH",
                  "presentation": 1,
                  "presentation_rect": [
                    830,
                    666,
                    202,
                    30
                  ],
                  "varname": "refresh",
                  "mode": 0,
                  "fontsize": 13.0,
                  "bgcolor": [
                    0.16,
                    0.2,
                    0.27,
                    1
                  ],
                  "textcolor": [
                    1,
                    1,
                    1,
                    1
                  ],
                  "rounded": 10.0
                }
              },
              {
                "box": {
                  "id": "refreshcmd",
                  "maxclass": "message",
                  "patching_rect": [
                    1100,
                    1075,
                    150,
                    22
                  ],
                  "text": "refresh"
                }
              },
              {
                "box": {
                  "id": "hint",
                  "maxclass": "comment",
                  "patching_rect": [
                    28,
                    713,
                    990,
                    25
                  ],
                  "text": "Click a title to launch it. STOP stops all clips and the transport.",
                  "presentation": 1,
                  "presentation_rect": [
                    28,
                    713,
                    990,
                    25
                  ],
                  "varname": "hint",
                  "fontsize": 14.0,
                  "textcolor": [
                    0.55,
                    0.63,
                    0.71,
                    1
                  ]
                }
              }
            ],
            "lines": [
              {
                "patchline": {
                  "source": [
                    "in",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "lb",
                    0
                  ],
                  "destination": [
                    "setup",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "setup",
                    0
                  ],
                  "destination": [
                    "win",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "previous",
                    0
                  ],
                  "destination": [
                    "previouscmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "previouscmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "stop",
                    0
                  ],
                  "destination": [
                    "stopcmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "stopcmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "start",
                    0
                  ],
                  "destination": [
                    "startcmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "startcmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "next",
                    0
                  ],
                  "destination": [
                    "nextcmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "nextcmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "pageup",
                    0
                  ],
                  "destination": [
                    "pageupcmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "pageupcmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "pagedown",
                    0
                  ],
                  "destination": [
                    "pagedowncmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "pagedowncmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row0",
                    0
                  ],
                  "destination": [
                    "row0cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row0cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row1",
                    0
                  ],
                  "destination": [
                    "row1cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row1cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row2",
                    0
                  ],
                  "destination": [
                    "row2cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row2cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row3",
                    0
                  ],
                  "destination": [
                    "row3cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row3cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row4",
                    0
                  ],
                  "destination": [
                    "row4cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row4cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row5",
                    0
                  ],
                  "destination": [
                    "row5cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row5cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row6",
                    0
                  ],
                  "destination": [
                    "row6cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row6cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row7",
                    0
                  ],
                  "destination": [
                    "row7cmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "row7cmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "refresh",
                    0
                  ],
                  "destination": [
                    "refreshcmd",
                    0
                  ]
                }
              },
              {
                "patchline": {
                  "source": [
                    "refreshcmd",
                    0
                  ],
                  "destination": [
                    "js",
                    0
                  ]
                }
              }
            ]
          }
        }
      },
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "patching_rect": [
            16,
            10,
            450,
            26
          ],
          "text": "DEBARULERS / STAGE CLICK",
          "presentation": 1,
          "presentation_rect": [
            16,
            10,
            450,
            26
          ],
          "fontsize": 19.0,
          "textcolor": [
            0.45,
            0.85,
            0.74,
            1
          ]
        }
      },
      {
        "box": {
          "id": "info",
          "maxclass": "comment",
          "patching_rect": [
            16,
            45,
            450,
            34
          ],
          "text": "On the click MIDI track, before the Drum Rack.",
          "presentation": 1,
          "presentation_rect": [
            16,
            45,
            450,
            34
          ],
          "fontsize": 14.0,
          "textcolor": [
            0.91,
            0.94,
            0.97,
            1
          ]
        }
      },
      {
        "box": {
          "id": "open",
          "maxclass": "textbutton",
          "patching_rect": [
            16,
            89,
            450,
            54
          ],
          "text": "OPEN PANEL",
          "presentation": 1,
          "presentation_rect": [
            16,
            89,
            450,
            54
          ],
          "fontsize": 22.0,
          "bgcolor": [
            0.12,
            0.44,
            0.36,
            1
          ],
          "textcolor": [
            1,
            1,
            1,
            1
          ]
        }
      },
      {
        "box": {
          "id": "openmsg",
          "maxclass": "message",
          "patching_rect": [
            280,
            250,
            50,
            22
          ],
          "text": "open"
        }
      },
      {
        "box": {
          "id": "pc",
          "maxclass": "newobj",
          "patching_rect": [
            280,
            285,
            65,
            22
          ],
          "text": "pcontrol"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "mi",
            0
          ],
          "destination": [
            "mo",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live",
            0
          ],
          "destination": [
            "defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "defer",
            0
          ],
          "destination": [
            "init",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init",
            0
          ],
          "destination": [
            "stage",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open",
            0
          ],
          "destination": [
            "openmsg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "openmsg",
            0
          ],
          "destination": [
            "pc",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pc",
            0
          ],
          "destination": [
            "stage",
            0
          ]
        }
      }
    ],
    "description": "Stage click controller for Ableton Live 11/12. Source patch for a Max MIDI Effect."
  }
}