import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Switch, Typography, Card, Space } from 'antd'
import IonIcon from 'shared/ionicon'

import { RootDispatch, RootState } from 'os/store'
import { setTheme } from 'os/store/ui.reducer'

const Theme = () => {
  const dispatch = useDispatch<RootDispatch>()
  const { theme } = useSelector((state: RootState) => state.ui)

  const onSwitch = (checked: boolean) => {
    return dispatch(setTheme(checked ? 'dark' : 'light'))
  }

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[18, 18]}>
        <Col span={24}>
          <Row gutter={[8, 8]} wrap={false} align="middle">
            <Col flex="auto">
              <IonIcon
                name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
              />
            </Col>
            <Col>
              <Switch
                size="small"
                checked={theme === 'dark'}
                onChange={onSwitch}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={0}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>
              {theme} theme
            </Typography.Text>
            <Typography.Paragraph
              type="secondary"
              style={{ fontSize: 12, margin: 0 }}
            >
              {theme === 'dark'
                ? "Dark mode will prolong device's power consumption, and reduce eye strain"
                : "Make graphics smoother, but might increase your device's power consumption"}
            </Typography.Paragraph>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Theme
