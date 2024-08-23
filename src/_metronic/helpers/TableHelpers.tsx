// Press Enter to filter
export const handleKeyPress = (
  event: React.KeyboardEvent<HTMLDivElement>,
  handleSubmitFilter: () => void
) => {
  if (event.key === 'Enter') {
    handleSubmitFilter()
  }
}
