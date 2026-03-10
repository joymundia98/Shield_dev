INSERT INTO attendance_records
(attendance_date, created_at, service_id, status, member_id, visitor_id, organization_id, headquarters_id)

SELECT
    d.service_date,
    NOW(),
    d.service_id,
    'Present',
    m.member_id,
    NULL,
    56,
    13
FROM members m

JOIN (
    SELECT
        gs::date AS service_date,
        CASE
            WHEN EXTRACT(DOW FROM gs) = 0 THEN 1      -- Sunday Service
            WHEN EXTRACT(DOW FROM gs) = 3 THEN 2      -- Midweek (Wednesday)
            WHEN EXTRACT(DOW FROM gs) = 5 THEN 3      -- Youth (Friday)
            WHEN EXTRACT(DOW FROM gs) = 6 AND random() < 0.25 THEN 4  -- Special Program (some Saturdays)
        END AS service_id
    FROM generate_series(
        '2025-01-01'::date,
        CURRENT_DATE,
        '1 day'
    ) gs
) d

ON d.service_date >= m.date_joined

WHERE d.service_id IS NOT NULL

-- Youth service restriction
AND (
    d.service_id <> 3
    OR m.age < 30
)

-- Realistic attendance probability
AND random() < 0.85;