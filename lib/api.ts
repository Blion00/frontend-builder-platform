const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://backend-builder-platform.vercel.app';

export async function getTemplates() {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function generateDocument(templateId: number, data: any) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId, data }),
  });
  if (!res.ok) throw new Error('Failed to generate document');
  return res.json();
}
