import json
from groq import AsyncGroq
from config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

MODEL = "llama-3.3-70b-versatile"

ROLE_SKILLS = {
    "Software Engineer": ["Python", "Java", "C++", "Data Structures", "Algorithms", "System Design", "Git", "SQL", "REST APIs", "Testing"],
    "Frontend Developer": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Next.js", "Redux", "Webpack", "Web Performance"],
    "Backend Developer": ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Docker", "Redis", "Microservices"],
    "Full Stack Developer": ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Docker", "REST APIs", "Git", "CI/CD", "AWS"],
    "Data Scientist": ["Python", "Machine Learning", "Statistics", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "SQL", "Data Visualization", "Jupyter"],
    "Data Analyst": ["SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics", "Data Cleaning", "ETL", "Pandas", "Business Intelligence"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker", "Kubernetes", "Feature Engineering", "Model Deployment", "Spark", "AWS SageMaker"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "AWS", "Linux", "Bash", "Monitoring", "Ansible"],
    "Cloud Engineer": ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "Networking", "IAM", "CloudFormation", "Cost Optimization"],
    "Cybersecurity Analyst": ["Network Security", "SIEM", "Penetration Testing", "Python", "Incident Response", "Vulnerability Assessment", "Firewalls", "Cryptography", "Compliance", "Threat Intelligence"],
    "UI/UX Designer": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "Accessibility", "CSS", "Adobe XD", "Information Architecture"],
    "Product Manager": ["Product Strategy", "Roadmapping", "Agile", "Scrum", "Stakeholder Management", "Data Analysis", "User Research", "JIRA", "A/B Testing", "Market Research"],
    "Business Analyst": ["Requirements Gathering", "SQL", "Excel", "Process Modeling", "BPMN", "Stakeholder Management", "Agile", "Documentation", "Data Analysis", "Tableau"],
    "Mobile App Developer": ["Swift", "Kotlin", "React Native", "Flutter", "REST APIs", "SQLite", "Firebase", "App Store", "Push Notifications", "UI Design"],
    "Database Administrator": ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "Performance Tuning", "Backup & Recovery", "Replication", "Indexing", "MongoDB", "Redis"],
}


async def extract_resume_data(text: str) -> dict:
    """Extract structured data from raw resume text using LLaMA."""
    prompt = f"""You are a resume parser. Extract structured information from this resume text.

Resume text:
{text[:6000]}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{{
  "name": "Full name or empty string",
  "email": "email or empty string",
  "phone": "phone or empty string",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {{"title": "Job title", "company": "Company", "duration": "Duration", "description": "Brief description"}}
  ],
  "education": [
    {{"degree": "Degree", "institution": "School", "year": "Year"}}
  ],
  "summary": "2-3 sentence professional summary"
}}"""

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.1,
    )
    raw = response.choices[0].message.content.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


async def analyze_skill_gap(resume_data: dict, target_role: str) -> dict:
    """Compare resume skills against target role requirements."""
    role_skills = ROLE_SKILLS.get(target_role, [])
    candidate_skills = [s.lower() for s in resume_data.get("skills", [])]

    # Quick pre-match before sending to AI
    matched = [s for s in role_skills if any(s.lower() in cs or cs in s.lower() for cs in candidate_skills)]
    missing = [s for s in role_skills if s not in matched]

    prompt = f"""You are an expert technical recruiter analyzing a resume for a {target_role} position.

Candidate skills: {resume_data.get("skills", [])}
Candidate experience: {json.dumps(resume_data.get("experience", [])[:3])}
Target role: {target_role}
Required skills for {target_role}: {role_skills}
Pre-identified matching skills: {matched}
Pre-identified missing skills: {missing}

Provide a precise skill gap analysis. Return ONLY valid JSON (no markdown, no explanation):
{{
  "score": <integer 0-100 representing overall match percentage>,
  "matching_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "summary": "2-3 sentence honest assessment of the candidate for this role",
  "recommendations": [
    {{"title": "Course/resource name", "description": "What this teaches and why it helps", "url": "https://..."}}
  ]
}}

For recommendations, suggest 4-5 specific, real learning resources (Coursera, Udemy, official docs, YouTube) targeting the missing skills."""

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.2,
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


async def generate_latex(resume_data: dict, target_role: str) -> str:
    """Generate an ATS-friendly LaTeX resume from parsed resume data."""
    prompt = f"""You are an expert LaTeX resume writer. Generate a complete, professional, ATS-friendly LaTeX resume.

Resume data:
{json.dumps(resume_data, indent=2)}

Target role: {target_role}

Requirements:
- Use the moderncv or a clean custom LaTeX format
- Must compile without errors on Overleaf
- ATS-friendly (no tables, no columns for key sections)
- Include all sections: header, summary, skills, experience, education
- Highlight skills relevant to {target_role}
- Professional formatting with proper spacing

Return ONLY the complete LaTeX code starting with \\documentclass, no explanation, no markdown fences."""

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000,
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()
