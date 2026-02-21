import json

with open('data/courses.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('JSON is valid')
print('Courses count:', len(data['courses']))
for c in data['courses']:
    print(f"  - {c['title']}: {c['category']}")
