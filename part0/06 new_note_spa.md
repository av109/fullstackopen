sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server and Response 201 Created
    server-->>browser: JOSN
    deactivate server

	 {content:"", date:""}

    browser execute event handler that render notes to display.