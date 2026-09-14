import { Component, Input, OnInit } from '@angular/core';
import { AiMockService } from '../../services/ai-mock.service';

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

/** The two chat UIs open with different welcome text in the source — `#geoChatLog`'s first
 *  message ("Tanya cepat...") vs. `#chatLog`'s ("Saya dapat merangkum..."). */
const WELCOME: { [key in 'compact' | 'full']: string } = {
  compact: 'Selamat datang. Tanya cepat seputar kawasan, risiko, atau anggaran.',
  full: 'Selamat datang. Saya dapat merangkum status kawasan, risiko, dan anggaran dari data pada dashboard ini.'
};

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
export class ChatPanelComponent implements OnInit {
  @Input() mode: 'compact' | 'full' = 'compact';

  readonly suggestions = ['kawasan mandiri', 'risiko tinggi', 'realisasi anggaran'];

  chatLog: ChatMessage[] = [];

  draft = '';

  constructor(private readonly ai: AiMockService) {}

  ngOnInit(): void {
    this.chatLog = [{ role: 'ai', text: WELCOME[this.mode] }];
  }

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
