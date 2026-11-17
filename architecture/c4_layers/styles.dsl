styles {
    element "Person" {
        shape person
        background #08427b
        color #ffffff
    }
    element "User" {
        background #08427b
        color #ffffff
    }
    element "External System" {
        background #999999
        color #ffffff
    }
    element "Software System" {
        background #1168bd
        color #ffffff
    }
    element "Container" {
        background #438dd5
        color #ffffff
    }
    element "Web Browser" {
        shape WebBrowser
        background #438dd5
        color #ffffff
    }
    element "Database" {
        shape Cylinder
        background #85bbf0
        color #000000
    }
    element "Storage" {
        shape Folder
        background #f4a261
        color #000000
    }
    element "API" {
        shape RoundedBox
        background #264653
        color #ffffff
    }
    element "Component" {
        background #85bbf0
        color #000000
    }
    element "Security" {
        shape Component
        background #d62828
        color #ffffff
    }
    element "IA" {
        background #8e44ad
        color #ffffff
    }
    relationship "sync" {
        dashed false
        routing curved
        position 50
    }
    relationship "async" {
        dashed true
        routing curved
        position 50
    }
}
