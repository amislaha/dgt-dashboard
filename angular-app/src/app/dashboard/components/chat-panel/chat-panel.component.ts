import { Component, Input } from '@angular/core';
import { AiMockService } from '../../services/ai-mock.service';

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

/**
 * Shared "Asisten AI" chat UI, used by BOTH the Geospasial embedded mini chat
 * (`mode="compact"`) and the Intelijen module's full chat panel
 * (`mode="full"`) — mirrors dashboard/index.html's deliberate duplication of
 * markup/wiring between `#geoChatLog`/`#geoChatInput`/`#geoChatSend` and
 * `#chatLog`/`#chatInput`/`#chatSend`, both calling the same `aiAnswer(q)`.
 * Each instance keeps its own local `chatLog`, so the two conversations do
 * not share history — same as the original.
 */
@Component({
  selector: 'dgt-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent {
  @Input() mode: 'compact' | 'full' = 'compact';

  readonly suggestions = ['kawasan mandiri', 'risiko tinggi', 'realisasi anggaran'];

  chatLog: ChatMessage[] = [
    { role: 'ai', text: 'Selamat datang. Saya dapat merangkum status kawasan, risiko, dan anggaran dari data pada dashboard ini.' }
  ];

  draft = '';

  constructor(private readonly ai: AiMockService) {}

  send(text: string): void {
    if (!text || !text.trim()) {
      return;
    }
    this.chatLog.push({ role: 'user', text });
    this.chatLog.push({ role: 'ai', text: this.ai.answer(text) });
    this.draft = '';
  }

  onSendClick(): void {
    this.send(this.draft);
  }

  onEnter(): void {
    this.send(this.draft);
  }

  onSuggestion(q: string): void {
    this.send(q);
  }
}
