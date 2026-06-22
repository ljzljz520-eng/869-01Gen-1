export function anonymizeName(badgeCode: string): string {
  const hash = badgeCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prefix = String.fromCharCode(65 + (hash % 26));
  const suffix = hash % 1000;
  return `访客${prefix}${suffix.toString().padStart(3, '0')}`;
}

export function anonymizeRecordForDisplay(industryName: string, willingToTalk: boolean): string {
  const talkText = willingToTalk ? '，期望与展商洽谈' : '';
  return `一位来自${industryName}领域的专业观众刚刚完成签到${talkText}`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}
