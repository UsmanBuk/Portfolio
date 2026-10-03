export default function IonIcon({ name, ...props }) {
  const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
  return <ion-icon name={name} {...props} aria-hidden={labelled ? undefined : 'true'}></ion-icon>
}
