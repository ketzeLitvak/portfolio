import styles from './HexValue.module.css';

export function HexValue({
  value,
  compare,
  label,
}: {
  value: string;
  compare?: string;
  label: string;
}) {
  return (
    <code className={styles.hex} aria-label={label}>
      {value ? (
        value.match(/.{1,8}/g)?.map((group, index) => (
          <span key={index}>
            {[...group].map((char, offset) => (
              <span
                key={offset}
                data-changed={compare !== undefined && char !== compare[index * 8 + offset]}
              >
                {char}
              </span>
            ))}
          </span>
        ))
      ) : (
        <span>—</span>
      )}
    </code>
  );
}
