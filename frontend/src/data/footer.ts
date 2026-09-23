import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", href: "/" },
            { name: "Explore Flats", href: "/explore" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Matches", href: "/matches" },
            { name: "Requests", href: "/requests" },
            { name: "Messages", href: "/messages" },
            { name: "Contact", href: "#contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms & Conditions", href: "#terms" },
        ]
    }
];