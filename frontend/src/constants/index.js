import { Database, Code, Terminal, Upload } from "lucide-react";

export const LAB_CATEGORIES = [
  {
    id: "sql-injection",
    name: "SQL Injection",
    icon: Database,
    labs: [
      {
        id: "sql-1",
        type: "basic",
        name: "Basic SQL Injection",
        status: "vulnerable",
        attempts: 0,
        completed: false,
      },
      {
        id: "sql-2",
        type: "basic",
        name: "Blind SQL Injection",
        status: "secure",
        attempts: 3,
        completed: false,
      },
    ],
  },
  {
    id: "xss",
    name: "Cross-Site Scripting",
    icon: Code,
    labs: [
      {
        id: "xss-1",
        type: "reflected",
        name: "Reflected XSS",
        status: "exploited",
        attempts: 5,
        completed: true,
      },
      {
        id: "xss-2",
        type: "stored",
        name: "Stored XSS",
        status: "vulnerable",
        attempts: 2,
        completed: false,
      },
      {
        id: "xss-3",
        type: "dom-based",
        name: "DOM-based XSS",
        status: "secure",
        attempts: 0,
        completed: false,
      },
    ],
  },
  
];
