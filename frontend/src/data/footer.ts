import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", href: "/" },
            { name: "Discover", href: "/discover" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Contact", href: "#contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms", href: "#terms" },
        ]
    }
];