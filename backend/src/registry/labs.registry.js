const LAB_REGISTRY = {
  sqli: {
    id: "sqli",
    name: "SQL Injection",
    image: "sqli-lab",
    category: "database",
    starter: "startSqlLab",
    ttl: 20,
    difficulties: ["easy", "medium", "hard", "secure"],
    flag: "FLAG{sql_master}",
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
    flag: "FLAG{xss_hunter}",
    enabled: true,
  },

  cmdi: {
    id: "cmdi",
    name: "Command Injection",
    starter: "startCmdiLab",
    image: "cmdi-lab",
    ttl: 15,
    category: "server-side",
    difficulties: ["easy", "medium", "hard", "secure"],
    flag: "FLAG{cmdi_shell_access}",
    enabled: true,
  },

  upload: {
    id: "upload",
    name: "File Upload Vulnerability",
    image: "upload-lab",
    starter: "startUploadLab",
    category: "server-side",
    ttl: 10,
    difficulties: ["easy", "medium", "hard", "secure"],
    flag: "FLAG{file_upload_bypass}",
    enabled: true,
  },
};
export { LAB_REGISTRY as labRegistry };