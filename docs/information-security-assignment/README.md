# ICT LMS Information Security Assignment

This assignment pack applies the security analysis to the existing ICT tuition LMS in this repository. It contains the five requested deliverables: security risk analysis, an information security policy, individual control ownership, a threat model and security design, and a viva demonstration plan.

## Deliverables

1. [Security risk analysis and control plan](risk-analysis.md)
2. [Information security policy](information-security-policy.md)
3. [Threat model and security design architecture](threat-model-and-architecture.md)
4. [Team control ownership](team-control-ownership.md)
5. [Viva demonstration plan](viva-demo.md)

## Application under review

The ICT LMS is a Next.js application backed by PostgreSQL and Prisma. It supports student accounts, grade and teaching-medium cohorts, course materials, quizzes and results, assignments and feedback, class links, and administrator content management. The application overview is in [`README.md`](../../README.md); the database entities are in [`prisma/schema.prisma`](../../prisma/schema.prisma).

## Assessment basis and limits

This is a preliminary, repository-based assessment of the source available for the assignment. It is not a penetration test, a production deployment review, or a legal compliance opinion. Ratings use the likelihood and impact scales in the risk analysis and should be revisited after deployment details, actual team membership, and any live verification are known. Proposed controls are recommendations; this pack does not say they have been implemented.

The team member names are represented as Member 1–5 because names and team size were not provided. Replace these labels with the actual members and adjust ownership if the team has a different size.

## Suggested viva format

Use a disposable database with one student and one administrator account. The demonstration plan shows existing controls that can be demonstrated honestly, then explains the proposed security improvements and their residual risks. Do not use real student records or real credentials in the presentation.
