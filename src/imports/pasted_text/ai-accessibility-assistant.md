Hero Section
Overview

Accessibility reviews are essential to building inclusive products, yet they remain one of the most manual and inconsistent steps in the design process.

As design teams scale, accessibility validation becomes dependent on individual expertise, lengthy review cycles, and manual checklist evaluations. This often results in delayed feedback, inconsistent recommendations, and accessibility issues reaching production.

To address this challenge, I designed and developed an AI-powered accessibility review assistant that analyzes UI screenshots against organizational accessibility standards and generates actionable recommendations within seconds.

The solution combines computer vision, accessibility heuristics, and organizational review frameworks to help teams identify issues earlier and create more accessible experiences at scale.

Problem
Accessibility Reviews Don't Scale

During product development, designers and developers regularly submit screens for accessibility reviews.

The existing workflow relied heavily on:

Manual checklist validation
Accessibility experts
Repetitive reviews
Individual interpretation of guidelines

A typical review process involved opening design files, comparing screens against multiple accessibility requirements, documenting issues, and manually generating feedback.

This process created several challenges:

Inconsistent Reviews

Different reviewers identified different issues.

Slow Feedback Cycles

Reviews often took 20–30 minutes per screen.

Knowledge Dependency

Teams relied heavily on accessibility specialists.

Delayed Issue Discovery

Accessibility issues were frequently identified late in the design cycle.

As the number of screens increased, the review process became increasingly difficult to scale.

Opportunity
What If Accessibility Reviews Were Instant?

Instead of asking reviewers to inspect every screen manually, I explored a different question:

Can we use AI to evaluate designs against accessibility standards before human review?

This would allow teams to:

Receive immediate feedback
Reduce repetitive review work
Improve consistency
Increase accessibility awareness across teams
Research
Understanding Existing Workflows

I interviewed:

Product Designers
UX Designers
Front-End Engineers
Accessibility Specialists
Quality Assurance Teams
Key Insight #1

Most accessibility reviews followed the same checklist.

Although reviewers varied, the evaluation framework remained largely consistent.

Key Insight #2

Many accessibility issues were visually detectable.

Examples included:

Low contrast text
Small touch targets
Missing hierarchy
Poor spacing
Weak visual affordances
Key Insight #3

Teams wanted recommendations, not just issue detection.

Identifying an issue was useful.

Understanding how to fix it was far more valuable.

Defining Success

The solution needed to:

Detect Issues

Identify accessibility concerns from screenshots.

Follow Organizational Standards

Validate designs against internal accessibility requirements.

Educate Teams

Explain why an issue matters.

Recommend Fixes

Provide actionable guidance.

Scale Reviews

Reduce dependency on manual evaluations.

Product Vision
AI Accessibility Review Assistant

A platform that enables designers and developers to upload screenshots and instantly receive accessibility feedback.

Workflow

Upload Screen

↓

AI Analysis

↓

Checklist Evaluation

↓

Issue Detection

↓

Recommendations

↓

Accessibility Report

Design Principles
1. Clarity Over Complexity

Accessibility should be understandable by everyone, not only specialists.

2. Action-Oriented Feedback

Every issue should include a recommendation.

3. Prioritization Matters

Critical issues should surface first.

4. Education Through Context

Users should learn accessibility while reviewing results.

Solution
Screenshot-Based Accessibility Analysis

Users upload a screen image.

The system automatically evaluates visual elements using AI-powered analysis and accessibility heuristics.

Organizational Accessibility Engine

Rather than relying solely on WCAG standards, the system incorporates organization-specific accessibility requirements.

Example checks:

Minimum font size
Touch target dimensions
Color contrast
Error visibility
Form usability
Visual hierarchy

This allows accessibility reviews to align with both industry standards and internal design systems.

Smart Recommendations

Most tools stop at issue identification.

I wanted recommendations to be actionable.

Instead of:

"Contrast issue detected"

The system provides:

"Increase text contrast from 2.8:1 to at least 4.5:1 to meet accessibility requirements."

This dramatically improves issue resolution speed.

Accessibility Health Score

To help teams prioritize improvements, the platform generates an accessibility score.

The score provides:

Overall compliance
Critical issue count
Progress tracking
Team visibility
Exportable Reports

Teams can export findings into structured reports containing:

Screenshots
Issue summaries
Recommendations
Severity classifications
Compliance status

This reduces documentation effort and supports stakeholder communication.

Design Process
Early Exploration

I explored three concepts.

Option 1

Traditional dashboard with manual checklists.

Rejected because it preserved existing inefficiencies.

Option 2

Accessibility overlay showing issues on screens.

Improved discoverability but lacked guidance.

Option 3

AI-powered accessibility assistant.

Combined analysis, prioritization, and recommendations.

Selected for further development.

Technical Implementation

Unlike many portfolio projects, this solution was not limited to visual design.

I also implemented the front-end experience.

Responsibilities
User research
Product strategy
Workflow design
Interaction design
Design system integration
Front-end development
AI workflow integration
Technology
React
TypeScript
AI Vision Processing
Rule-Based Accessibility Engine
Impact
Before

Accessibility reviews required manual evaluation.

Feedback quality depended on reviewer expertise.

Review turnaround varied significantly.

After

Teams received immediate accessibility feedback.

Review consistency improved.

Accessibility knowledge became more accessible across teams.

Manual review effort was significantly reduced.

Key Learnings
Accessibility Is a Scalability Problem

The challenge isn't simply identifying issues.

It's enabling teams to identify them consistently.

AI Works Best as an Assistant

The goal was not replacing accessibility experts.

The goal was amplifying their impact.

Recommendations Drive Adoption

Users valued actionable guidance more than issue detection alone.

Reflection

This project challenged me to think beyond interface design and approach accessibility as a systems problem.

By combining AI, accessibility standards, and workflow automation, I created a solution that helps teams build more inclusive products while reducing review overhead.

The experience strengthened my ability to operate across product strategy, UX design, engineering, and AI-assisted workflows—areas increasingly critical in modern product development.