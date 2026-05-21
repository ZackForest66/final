export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export function generateShareText(_personalityCode: string, chineseName: string, englishName: string): string {
  return `我在 ARTYPE 测试中发现了我的艺术原型——${chineseName}（${englishName}）！快来测测你的艺术人格是什么？`;
}

export function getShareUrl(): string {
  return window.location.href;
}

export function shareToWeibo(text: string, url: string): void {
  const shareUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

export function shareToTwitter(text: string, url: string): void {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}
