const LAB_REGISTRY = {
  sqli: {
    id: "sqli",
    name: "SQL Injection",
    image: "sqli-lab",
    category: "database",
    starter: "startSqlLab",
    ttl: 20,
    difficulties: ["easy", "medium", "hard", "secure"],
    enabled: true,
  },

  xss: {
    id: "xss",
    name: "Cross-Site Scripting",
    starter: "startXssLab",
    ttl: 10,
    image: "xss-lab",
    category: "client-side",
    difficulties: ["easy", "medium", "hard", "secure"],
    enabled: true,
  },

  cmdi: {
    id: "cmdi",
    name: "Command Injection",
    starter: "startCmdiLab",
    starter: "startUploadLab",
    image: "cmdi-lab",
    ttl: 15,
    category: "server-side",
    difficulties: ["easy", "medium", "hard", "secure"],
    enabled: true,
  },

  upload: {
    id: "upload",
    name: "File Upload Vulnerability",
    image: "upload-lab",
    category: "server-side",
    ttl: 10,
    difficulties: ["easy", "medium", "hard", "secure"],
    enabled: true,
  },
};
export { LAB_REGISTRY as labRegistry };