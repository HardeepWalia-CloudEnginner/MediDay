import { ChatMessage } from '@/lib/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

function renderFormattedContent(content: string) {
  const blocks = content.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, idx) => {
    const lines = block.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const isOrderedList = lines.every((line) => /^\d+[\.)]\s+/.test(line));
    const isUnorderedList = lines.every((line) => /^[-*]\s+/.test(line));

    if (isOrderedList) {
      return (
        <ol key={idx} style={{ margin: '0 0 1rem 1.2rem', padding: 0, color: '#333' }}>
          {lines.map((line, lineIdx) => (
            <li key={lineIdx} style={{ marginBottom: '0.5rem' }}>
              {line.replace(/^\d+[\.)]\s+/, '')}
            </li>
          ))}
        </ol>
      );
    }

    if (isUnorderedList) {
      return (
        <ul key={idx} style={{ margin: '0 0 1rem 1.2rem', padding: 0, color: '#333' }}>
          {lines.map((line, lineIdx) => (
            <li key={lineIdx} style={{ marginBottom: '0.5rem' }}>
              {line.replace(/^[-*]\s+/, '')}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={idx} style={{ margin: idx === 0 ? 0 : '1rem 0' }}>
        {lines.join(' ')}
      </p>
    );
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message ${message.sender}`}>
      <div className="message-bubble">
        <div style={{ lineHeight: '1.7' }}>{renderFormattedContent(message.content)}</div>

        {message.sender === 'bot' && message.retrievalType && (
          <div className="retrieval-badge">Retrieval: {message.retrievalType}</div>
        )}

        {message.sender === 'bot' && message.citations && message.citations.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#004085', marginBottom: '10px' }}>
              📚 Sources
            </div>
            {message.citations.map((citation, idx) => (
              <div key={idx} className="source-citation" style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: '700', color: '#0d6efd', marginBottom: '4px' }}>
                  {citation.documentName}
                </div>
                <div style={{ color: '#495057', marginBottom: '4px' }}>
                  <strong>Section:</strong> {citation.sectionTitle}
                </div>
                {citation.content && (
                  <div style={{ color: '#333', fontSize: '13px', marginBottom: '4px' }}>
                    {citation.content.length > 240 ? `${citation.content.substring(0, 240)}...` : citation.content}
                  </div>
                )}
                {citation.sourceUrl && (
                  <div style={{ color: '#0d6efd', fontSize: '12px' }}>
                    <a href={citation.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#0d6efd' }}>
                      View source
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
