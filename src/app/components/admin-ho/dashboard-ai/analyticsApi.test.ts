import {parseConversationsResponse, parseDashboardResponse, unwrapAnalyticsResponse} from './analyticsApi'

describe('Analytics API responses', () => {
  it('unwraps the backend envelope for dashboard, chat and conversations', () => {
    const dashboard = {total_order: 10, monthly: [], statuses: [], stores: []}
    expect(parseDashboardResponse({status: 200, message: 'SUCCESS', data: dashboard})).toEqual(dashboard)
    expect(unwrapAnalyticsResponse({status: 201, message: 'SUCCESS', data: {answer: 'Jawaban', conversation_id: 2}})).toEqual({answer: 'Jawaban', conversation_id: 2})
    expect(parseConversationsResponse({status: 200, message: 'SUCCESS', data: []})).toEqual([])
  })
  it('rejects incomplete dashboard or invalid history instead of crashing the page', () => {
    expect(() => parseDashboardResponse({status: 200, data: {total_order: 1}})).toThrow()
    expect(() => parseConversationsResponse({status: 200, data: {}})).toThrow()
  })
})
