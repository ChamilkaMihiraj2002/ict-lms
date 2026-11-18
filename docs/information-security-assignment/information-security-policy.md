# ICT LMS Information Security Policy

**Document owner:** LMS service owner  
**Applies to:** application administrators, teachers with administrator access, developers, and service operators  
**Review cycle:** at least annually and after a significant security incident or system change  
**Status:** proposed policy for the assignment; approval and effective date must be completed by the institution

## 1. Purpose

This policy sets the minimum rules for protecting the ICT LMS and its student, assessment, and teaching information. It supports confidentiality, integrity, availability, and appropriate use of the service.

## 2. Information covered

The policy covers account identifiers, grade and teaching-medium information, password hashes, learning progress, quiz attempts and marks, assignment submissions and teacher feedback, course content, administrator actions, application secrets, and database backups.

## 3. Roles and responsibilities

- **Service owner:** approves access, risk acceptance, retention periods, incident decisions, and recovery objectives.
- **Administrator/teacher:** uses a named account, protects credentials, views only information needed for teaching, and reports suspected incidents promptly.
- **Developer:** follows secure coding and review requirements, validates data on the server, protects secrets, and records security-relevant changes.
- **Database/operations owner:** restricts database access, maintains encrypted backups, applies updates, monitors service health, and tests restoration.
- **Student:** keeps credentials private, uses the service for learning, and reports suspected account misuse or exposed content.

One person may hold more than one operational role in a small deployment, but privileged actions must remain attributable to a named account.

## 4. Account and access control

1. Every user must have an individual account. Shared accounts are prohibited.
2. New registrations receive the student role only. Administrator access is granted by an authorized service owner through the documented provisioning process.
3. Administrator accounts must use multi-factor authentication once supported and must be limited to the people who need them.
4. Access must follow least privilege. Student records, submissions, grades, and content must be scoped to the user's authorization and cohort. The server must make the final authorization decision; hiding a page or control in the browser is not sufficient.
5. Administrators must review privileged accounts at least each academic term and remove access promptly when a person changes duties or leaves.
6. High-impact actions, including role changes, account deletion, and grade changes, must be attributable in an audit trail. Re-authentication or a second-person review should be used for especially sensitive operations where operationally practical.

## 5. Authentication and session handling

1. Passwords must be stored only as approved salted password hashes; plaintext passwords must never be logged or stored.
2. The service must enforce a documented password length and block common or compromised passwords. Passwords must not be reused for administrator accounts.
3. Login attempts must be rate-limited and monitored. Authentication errors should not reveal whether an email address is registered.
4. Session cookies must be `HttpOnly`, `Secure` in production, and use an appropriate `SameSite` setting. Production traffic must use HTTPS.
5. Sessions must expire after a defined period. Logout, password reset, account disablement, or suspected compromise must revoke or invalidate active sessions as soon as the application supports it.
6. High-risk administrator actions must require a current authenticated session; administrator MFA is required by policy when available.

## 6. Acceptable use and content safety

1. Users may access only information needed for their role and learning cohort.
2. Administrators must publish material appropriate to the target grade and medium and must not place personal, confidential, or harmful content in lessons or announcements.
3. Lesson content must be rendered as safe text/Markdown. Raw HTML must be sanitized, and executable examples must run in an isolated sandbox that cannot access the LMS session or APIs.
4. External links must use approved web schemes and should be checked before publication. Users must treat links in submissions as untrusted.
5. Automated scraping, credential sharing, attempts to bypass authorization, and use of the system to distribute malicious code are prohibited.

## 7. Data handling and privacy

1. Collect and retain only data needed to provide the learning service.
2. Student identity, marks, submissions, and feedback must be treated as restricted educational information. Access is limited to the student concerned and authorized teaching/administrative staff according to role.
3. Passwords, session tokens, database credentials, and signing secrets must never be committed to source control, included in client code, or exposed in logs.
4. Production databases must not be reachable directly from the public internet. Application-to-database traffic must use an approved protected connection, and production storage and backups must be encrypted where supported by the hosting platform.
5. Data exports and support copies must be stored in approved locations with access controls and deleted when no longer needed.
6. The service owner must approve a retention schedule for inactive accounts, learning records, logs, and backups, including any institutional requirements. This policy does not invent a fixed retention period.

## 8. Secure development and change management

1. All access checks and data validation must occur on the server, close to the data operation.
2. Changes to authentication, authorization, personal data, or administrator actions require review by another team member before release.
3. Dependencies and the runtime must be kept on supported versions; security advisories must be assessed and addressed according to severity.
4. Production secrets must be managed outside the repository and rotated if exposed or when the responsible operator changes.
5. Production deployments must use HTTPS and suitable security response headers, including a tested Content Security Policy.
6. A release must not be approved with a known Critical risk unless the service owner records a time-limited exception and compensating controls.

## 9. Logging, monitoring, and incident response

1. Record security-relevant events such as failed logins, successful administrator login, role changes, account deletion, grade changes, and changes to published content.
2. Logs must be access-controlled, time-synchronized, retained according to the approved schedule, and protected against ordinary users' modification.
3. Do not put passwords, cookie values, signing keys, full assignment answers, or unnecessary personal data in logs.
4. Operators must monitor for repeated authentication failures, unexpected privilege changes, unusual access patterns, service errors, and backup failures.
5. Anyone who suspects account compromise, data exposure, malicious content, or service disruption must report it promptly to the service owner. The owner must contain the issue, preserve relevant evidence, assess affected users/data, restore safe operation, and record corrective actions.

## 10. Backup, recovery, and availability

1. Production data must be backed up automatically on an approved schedule. Backups must be encrypted and access-controlled.
2. The service owner must define recovery point and recovery time objectives with the institution.
3. Restoration must be tested at least once per term and after a major database or hosting change. A backup is not considered reliable until restoration has been demonstrated.
4. Database migrations and destructive operations must have a reviewed recovery plan.

## 11. Exceptions and enforcement

Exceptions require written approval from the service owner, a reason, a compensating control, an owner, and an expiry date. Policy violations may result in access suspension and institutional follow-up according to applicable procedures. This policy should be read with the institution's student privacy, acceptable use, and records-retention policies.
