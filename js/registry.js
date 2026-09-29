export const COMPONENTS = {
    section: {
        label: "Section",
        isContainer: true,
        defaults: {
            styles: { padding:"32px 16px", backgroundColor: "#ffffff"}
        }
    },
    heading: {
        label: "Heading",
        isContainer:false,
        defaults: {
            content: "Heading",
            styles: {
                fontStyle: "32px",
                color: "#111111",
                fontWeight: "700"
            }
        }
    },
    paragraph: {
        label: "Paragraph",
        isContainer: false,
        defaults: {
            content: "Write something here...",
            styles: {
                fontSize: "16px",
                color: "#333333",
                lineHeight: "1.5",
                lineSpace: "2"
            }
        }
    },
}