#!/usr/bin/env python3
"""Fictional "old system" exports for the Vera demo clinic, for the Platform cue film.

Writes the three files reconcile.py reads, in the shapes it reads them:
  facesexport.csv     the consent and client system (Sr No, First Name, Last Name, Email, Mobile No)
  acuity-export.csv   the booking system's appointments, with the practitioner's notes
  mailchimp.zip       the mailing list's subscribed and unsubscribed exports

Everyone is made up: example.com addresses, 07700 900xxx numbers (Ofcom's drama range).
Three of them are on Vera's platform already (Daisy, Isla, Priya); the rest are past
patients who never signed up online. Three people's notes mention skin booster lot SB-4471,
which the film searches for (the console's batch recall).

    python3 gen-vera-legacy.py <data folder outside the workspace>
"""
import csv, io, os, sys, zipfile
from datetime import datetime, timedelta

out = sys.argv[1]
os.makedirs(out, exist_ok=True)

# (first, last, email, mobile, on mailing list)
PEOPLE = [
    ('Daisy', 'Russell', 'daisy.russell@example.com', '07700 900101', 'subscribed'),
    ('Isla', 'Parry', 'isla.parry@example.com', '07700 900102', 'subscribed'),
    ('Priya', 'Vaughan', 'priya.vaughan@example.com', '07700 900103', 'subscribed'),
    ('Amira', 'Khan', 'amira.khan@example.com', '07700 900104', None),
    ('Beth', 'Lowe', 'beth.lowe@example.com', '07700 900105', 'subscribed'),
    ('Carys', 'Doyle', 'carys.doyle@example.com', '07700 900106', 'subscribed'),
    ('Fern', 'Walsh', 'fern.walsh@example.com', '07700 900107', None),
    ('Jo', 'Adair', 'jo.adair@example.com', '07700 900108', 'unsubscribed'),
    ('Kemi', 'Bello', 'kemi.bello@example.com', '07700 900109', None),
    ('Lena', 'Ross', 'lena.ross@example.com', '07700 900110', None),
    ('Mia', 'Grant', 'mia.grant@example.com', '07700 900111', 'subscribed'),
    ('Nell', 'Price', 'nell.price@example.com', '07700 900112', None),
]

# (person index, date, time, type, note)
LOT = 'SB-4471'
APPTS = [
    (0, '2024-03-14', '10:30', 'Consultation', 'Concerned about dullness and fine lines around the eyes. Talked through skin boosters and a peel; no treatment today. Sun care and retinol advice given.'),
    (0, '2024-04-02', '11:00', 'Skin Boosters', f'Skin booster, first of three. 2ml, lot {LOT}. Mild redness at injection points, settled before she left. Aftercare sheet given.'),
    (0, '2024-05-07', '11:00', 'Skin Boosters', f'Second session, lot {LOT}. Reports skin feels more hydrated. Small bruise left cheek last time, resolved in 4 days.'),
    (0, '2024-06-11', '11:00', 'Skin Boosters', 'Third session, lot SB-4502. Happy with result. Review in 6 months, maintenance discussed, no pressure.'),
    (0, '2025-01-21', '15:30', 'Chemical Peel', 'Light peel ahead of a wedding in February. Patch test fine. Advised no exfoliants for 5 days.'),
    (1, '2024-02-20', '09:30', 'Consultation', 'First visit. Wants to look less tired. Discussed sleep, hydration and a course of microneedling.'),
    (1, '2024-03-05', '09:30', 'Microneedling', '1.0mm across cheeks and forehead. Tolerated well. Next in 4 weeks.'),
    (1, '2024-04-02', '09:30', 'Microneedling', 'Second session, 1.0mm. Texture improving.'),
    (2, '2025-06-03', '13:00', 'Dermaplaning', 'Dermaplaning before a holiday. No issues.'),
    (2, '2025-09-16', '13:00', 'Chemical Peel', 'Light peel. Mild tingling, settled.'),
    (3, '2023-11-08', '10:00', 'Consultation', 'Pigmentation on cheeks. Advised SPF daily and a series of peels in winter.'),
    (3, '2023-12-06', '10:00', 'Chemical Peel', 'First peel. Patch test fine.'),
    (3, '2024-01-10', '10:00', 'Chemical Peel', 'Second peel. Pigment lighter.'),
    (4, '2024-07-18', '16:00', 'Skin Boosters', 'Skin booster, single session, lot SB-4502. No reaction.'),
    (5, '2024-10-01', '12:00', 'Consultation', 'Interested in skin boosters for neck. Booked follow-up.'),
    (5, '2024-10-22', '12:00', 'Skin Boosters', 'Neck, 2ml, lot SB-4502. Fine.'),
    (6, '2024-03-28', '14:00', 'Skin Boosters', f'Skin booster, 2ml, lot {LOT}. Some swelling under left eye, cold compress, settled. Phoned next day, all fine.'),
    (6, '2024-04-25', '14:00', 'Skin Boosters', 'Second session, lot SB-4502. No swelling this time.'),
    (7, '2023-09-12', '11:30', 'Dermaplaning', 'Dermaplaning. Sensitive skin, gentle approach.'),
    (7, '2024-02-14', '11:30', 'Dermaplaning', 'Repeat. Fine.'),
    (8, '2024-04-09', '17:00', 'Consultation', 'Wants more glow before her 40th. Talked through skin boosters.'),
    (8, '2024-04-16', '17:00', 'Skin Boosters', f'Skin booster, 2ml, lot {LOT}. Tolerated well.'),
    (8, '2024-05-21', '17:00', 'Skin Boosters', 'Second session, lot SB-4502. Very pleased.'),
    (9, '2025-02-04', '10:30', 'Microneedling', '0.75mm, first session. Mild redness.'),
    (9, '2025-03-04', '10:30', 'Microneedling', '1.0mm. Good.'),
    (10, '2025-04-15', '15:00', 'Consultation', 'Acne scarring. Microneedling course recommended, realistic expectations set.'),
    (10, '2025-05-06', '15:00', 'Microneedling', '1.5mm on scarring. Tolerated.'),
    (10, '2025-06-03', '15:00', 'Microneedling', 'Second session. Visible softening.'),
    (11, '2023-10-19', '09:00', 'Chemical Peel', 'Medium-depth peel. Downtime explained, 5 to 7 days.'),
    (11, '2024-10-24', '09:00', 'Chemical Peel', 'Repeat after a year. Happy.'),
]

with open(os.path.join(out, 'facesexport.csv'), 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh)
    w.writerow(['Sr No', 'First Name', 'Last Name', 'Email', 'Mobile No'])
    for i, (f, l, e, m, _) in enumerate(PEOPLE, 1):
        w.writerow([i, f, l, e, m])

with open(os.path.join(out, 'acuity-export.csv'), 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh)
    w.writerow(['Appointment ID', 'Start Time', 'Type', 'Calendar', 'Notes', 'First Name', 'Last Name', 'Email', 'Phone'])
    for n, (pi, day, time, kind, note) in enumerate(APPTS, 1):
        f, l, e, m, _ = PEOPLE[pi]
        start = datetime.strptime(f'{day} {time}', '%Y-%m-%d %H:%M').strftime('%B %d, %Y %H:%M')
        w.writerow([700000 + n, start, kind, 'Vera', note, f, l, e, m])

with zipfile.ZipFile(os.path.join(out, 'mailchimp.zip'), 'w') as z:
    for status in ('subscribed', 'unsubscribed'):
        buf = io.StringIO(); w = csv.writer(buf)
        w.writerow(['Email Address', 'First Name', 'Last Name'])
        for f, l, e, m, s in PEOPLE:
            if s == status: w.writerow([e, f, l])
        z.writestr(f'{status}_members_export_vera.csv', buf.getvalue())

print(f'{len(PEOPLE)} people, {len(APPTS)} appointments, lot {LOT} in {sum(LOT in a[4] for a in APPTS)} notes ->', out)
