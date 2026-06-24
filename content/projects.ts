export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  stack: string[];
  tags: ("security" | "ai-ml" | "backend" | "fullstack")[];
  description: string;
  highlights: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "wraithrun",
    title: "WraithRun: Local-First AI Incident Triage",
    tagline:
      "Agentic ReAct loop in Rust that runs host-level investigations on a local LLM.",
    year: "2026",
    stack: ["Rust", "ONNX Runtime", "GGUF", "SafeTensors", "ReAct", "SQLite"],
    tags: ["security", "ai-ml"],
    description:
      "An incident-response runtime that triages host evidence on the analyst's machine using a local LLM (ONNX, GGUF, or SafeTensors). An agentic ReAct loop iteratively picks investigation tools (logs, listeners, persistence, accounts, processes) and synthesizes severity-scored findings with full audit trails. Supports multiple backends (CPU, CUDA, DirectML, CoreML, TensorRT, QNN, Vitis) and falls back to a deterministic dry-run so triage never stalls when inference fails.",
    highlights: [
      "Bring your own model. No cloud APIs, no data exfiltration, no vendor lock-in.",
      "Evidence bundles with SHA-256 chain-of-custody and a JSON adapter for SOAR / CI gating.",
      "Deterministic fallback when live inference fails, with machine-readable reason codes.",
    ],
    links: [
      { label: "github", href: "https://github.com/sankpal-shreyas/WraithRun" },
      {
        label: "docs",
        href: "https://wraithrun.readthedocs.io/en/latest/",
      },
    ],
  },
  {
    slug: "memoryroots",
    title: "MemoryRoots: Offline AI for Indigenous Knowledge",
    tagline:
      "Offline-first Gemma agent that interviews village elders and builds a searchable knowledge graph.",
    year: "2026",
    stack: ["Python", "Gemma", "Ollama", "Unsloth", "ChromaDB", "SQLite", "Whisper", "Gradio"],
    tags: ["ai-ml", "fullstack"],
    description:
      "A fully offline system to preserve endangered indigenous knowledge in communities where cloud AI isn't an option. A single Gemma model runs voice-guided interviews with elders, identifies plants, tools, and artifacts from photos, and uses native function calling to turn transcripts into structured knowledge-graph entries. Retrieval blends FTS5 keyword search with ChromaDB semantic search, and every answer cites the elder it came from and surfaces safety warnings. Ships an Unsloth LoRA fine-tuning recipe and a Gemma Edge fallback for mobile-class hardware.",
    highlights: [
      "100% offline inference. No cloud APIs or keys; one Gemma model handles reasoning, vision, and extraction.",
      "Hybrid retrieval (FTS5 keyword + ChromaDB semantic) with per-elder attribution and safety surfacing.",
      "Offline speech-to-text (Whisper) and text-to-speech in 100+ languages (espeak-ng).",
    ],
    links: [
      { label: "github", href: "https://github.com/sankpal-shreyas/MemoryRoots" },
      {
        label: "demo",
        href: "https://huggingface.co/spaces/shreyas-sankpal/MemoryRoots",
      },
    ],
  },
  {
    slug: "pyfaest",
    title: "pyfaest: Python Bindings for FAEST",
    tagline:
      "PyPI-published CFFI bindings to the NIST-PQC FAEST signature scheme. All 12 parameter sets, prebuilt wheels.",
    year: "2025",
    stack: ["Python", "C", "CFFI", "NIST PQC", "FAEST"],
    tags: ["security"],
    description:
      "A Python wrapper around the C reference implementation of FAEST, a NIST post-quantum signature candidate built on symmetric primitives (AES-VOLE) instead of structured lattices. Ships all 12 FAEST parameter sets with automatic memory-clearing of private keys. Prebuilt wheels for Linux x86_64/aarch64 and macOS arm64/x86_64 across Python 3.8 to 3.13, so consumers don't need a C toolchain.",
    highlights: [
      "All 12 FAEST parameter sets (128/192/256-bit, fast vs small variants, EM mode).",
      "Prebuilt wheels. No compilation step for end users.",
      "Pythonic API with typed exceptions for keygen / sign / verify failure paths.",
    ],
    links: [
      { label: "github", href: "https://github.com/sankpal-shreyas/pyfaest" },
      { label: "pypi", href: "https://pypi.org/project/pyfaest" },
    ],
  },
  {
    slug: "civic-aid-navigator",
    title: "Civic-Aid Navigator: Multi-Channel Disaster Aid",
    tagline:
      "Government disaster-aid intake across web, SMS, and a caseworker dashboard, powered by IBM watsonx Granite agents.",
    year: "2026",
    stack: ["React", "TypeScript", "Vite", "Netlify Functions", "IBM watsonx.ai", "Granite"],
    tags: ["ai-ml", "fullstack"],
    description:
      "A disaster-relief intake platform built for IBM's AI Experiential Learning Lab that meets citizens wherever their connectivity allows. Three surfaces share one agent workflow: a universal web intake form, an SMS path for low-bandwidth and feature-phone users, and a caseworker triage dashboard. An agentWorkflow service layer wraps IBM watsonx.ai Granite models and Orchestrate skills behind a deterministic mock mode, so demos stay reliable with zero credentials while real models drop in via env vars.",
    highlights: [
      "Three intake channels (web, SMS, agency dashboard) over a single agent workflow.",
      "watsonx Granite + Orchestrate hooks with a credential-free mock mode for reliable demos.",
      "Netlify serverless deployment with a live public POC.",
    ],
    links: [
      { label: "github", href: "https://github.com/sankpal-shreyas/Civic-Aid-Navigator" },
      {
        label: "demo",
        href: "https://civic-aid-navigator-poc.netlify.app/",
      },
    ],
  },
  {
    slug: "saaransh",
    title: "SAARANSH: AI Minutes of Meeting",
    tagline: "Fine-tuned BART-large for long-transcript meeting summarization.",
    year: "2024",
    stack: ["Python", "PyTorch", "BART", "Node.js", "Puppeteer", "React", "AWS", "AKS"],
    tags: ["ai-ml", "fullstack"],
    description:
      "Led a 4-person team to build an end-to-end AI meeting-minutes generator. Fine-tuned BART-large on AMI and ICSI datasets and extended the effective context from 1024 to 8000+ tokens using n-gram overlap stitching. Deployed as microservices behind a Node.js/Puppeteer bot that joins Google Meet calls and streams transcripts in real time.",
    highlights: [
      "Context extension from 1024 to 8000+ tokens via n-gram overlap.",
      "Autonomous Google Meet bot (Node + Puppeteer).",
      "2 copyrights + merit position at Aavishkar Research Convention 2024.",
    ],
    links: [
      { label: "demo", href: "https://drive.google.com/file/d/12mPnPRaFQeVahQbO6tN7ndSrJGA4Ee5v/view?usp=drive_link" },
    ]
  },
  {
    slug: "tracing-e-messages",
    title: "Tracing E-Messages via Digital Stamping",
    tagline:
      "Elliptic-curve signatures + smart contracts to attribute electronic messages.",
    year: "2022",
    stack: ["Solidity", "Node.js", "React", "Ethereum", "ECDSA"],
    tags: ["security"],
    description:
      "Smart India Hackathon prototype. Built a system for law enforcement to trace the origin and propagation of flagged electronic messages using ECDSA digital signatures anchored to a blockchain. Wrote the API gateway for smart-contract integration and a React dashboard for forensics analysts.",
    highlights: [
      "ECDSA-signed envelopes anchored on-chain.",
      "API gateway bridging Node and Solidity contracts.",
      "Poster at Conference on Technologies for Future Cities 2022.",
    ],
  },
];
