export async function uploadSupportTicket(ticket: any) {
const dropboxToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
// use secure env variables

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${dropboxToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: `/support-tickets/ticket-${Date.now()}.json`,
        mode: 'add',
        autorename: true,
        mute: false,
      })
    },
    body: JSON.stringify(ticket)
  });

  if (!response.ok) {
    throw new Error('Failed to upload support ticket');
  }

  return response.json();
}
