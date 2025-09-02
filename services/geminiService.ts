
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PfSenseData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeSecurityData = async (data: PfSenseData): Promise<GenerateContentResponse> => {
  // Extract suspicious IPs from logs (blocked traffic or failed logins)
  const suspiciousSystemLogIPs = data.systemLogs
    .filter(log => log.message.toLowerCase().includes('failed') && log.sourceIp)
    .map(log => log.sourceIp!);

  const suspiciousFirewallLogIPs = data.firewallLogs
    .filter(log => log.action === 'block')
    .map(log => log.sourceIp);

  const uniqueSuspiciousIPs = [...new Set([...suspiciousSystemLogIPs, ...suspiciousFirewallLogIPs])];

  if (uniqueSuspiciousIPs.length === 0) {
    // If no suspicious IPs, run a general analysis without search.
    const prompt = `
      You are a world-class cybersecurity analyst specializing in pfSense firewall configurations.
      Analyze the following pfSense dashboard data from an EC2 instance. No suspicious IPs were detected in the logs, but please provide a general security assessment.
      Provide a concise, actionable security report based on industry best practices.

      Your report should have three sections:
      1.  **Security Posture Summary:** A brief, high-level overview of the current security status.
      2.  **Identified Risks & Vulnerabilities:** A bulleted list of potential security issues based on firewall rules and system configuration.
      3.  **Actionable Recommendations:** A bulleted list of concrete steps for hardening the firewall.

      Here is the data in JSON format:
      ${JSON.stringify(data, null, 2)}
    `;
     try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not retrieve security analysis. Please check your API key and network connection.");
    }
  }

  const prompt = `
    You are a world-class cybersecurity analyst. Using Google Search, analyze the following suspicious IP addresses observed in pfSense firewall logs from an EC2 instance.
    Provide a concise, actionable threat intelligence report.

    The report must have three sections:
    1.  **Threat Summary:** A brief, high-level overview of the findings based on the search results.
    2.  **IP Address Analysis:** A bulleted list. For each suspicious IP, provide sub-bullets detailing the potential threat (e.g., Brute-force attempts, Known scanner, Malware C2).
    3.  **Actionable Recommendations:** A bulleted list of concrete steps the administrator should take based on the threat intelligence (e.g., "Create a firewall alias for these IPs and block all traffic," "Monitor for further activity from these subnets").

    Here is the list of suspicious IP addresses to investigate:
    ${uniqueSuspiciousIPs.join(', ')}

    Analyze the IPs and generate the report. Base your analysis on real-time threat intelligence from Google Search.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
    });
    return response;
  } catch (error) {
    console.error("Error calling Gemini API with Google Search:", error);
    throw new Error("Could not retrieve security analysis. Please check your API key and network connection.");
  }
};
