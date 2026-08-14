import StatementPreviewDialog from '@/views/business/statements/StatementPreviewDialog'

describe('statement preview and print flow', () => {
  it('does not print before preview has loaded', () => {
    const print = jest.fn(() => true)
    const context = { expired: false, previewReady: false, $refs: { pdf: { print } }, $message: { error: jest.fn() }, $t: key => key }
    StatementPreviewDialog.methods.print.call(context)
    expect(print).not.toHaveBeenCalled()
    expect(context.$message.error).toHaveBeenCalled()
  })

  it('prints only after a successful, unexpired preview', () => {
    const print = jest.fn(() => true)
    const context = { expired: false, previewReady: true, $refs: { pdf: { print } }, $message: { error: jest.fn() }, $t: key => key }
    StatementPreviewDialog.methods.print.call(context)
    expect(print).toHaveBeenCalledTimes(1)
    expect(context.$message.error).not.toHaveBeenCalled()
  })

  it('stops printing after the access expires', () => {
    const print = jest.fn(() => true)
    const context = { expired: true, previewReady: true, $refs: { pdf: { print } }, $message: { error: jest.fn() }, $t: key => key }
    StatementPreviewDialog.methods.print.call(context)
    expect(print).not.toHaveBeenCalled()
  })
})
