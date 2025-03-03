import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { Modal, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/ionicon'

import { RootState } from 'os/store'
import PDB from 'shared/pdb'

const ConfirmRestore = ({
  cid,
  onClose = () => {},
}: {
  onClose?: () => void
  cid: string
}) => {
  const { address } = useSelector((state: RootState) => state.wallet)

  const onRestore = useCallback(async () => {
    try {
      const pdb = new PDB(address)
      await pdb.restore(cid)
      return (window.location.href = '/welcome')
    } catch (er) {
      return window.notify({
        type: 'error',
        description: (er as any).message,
      })
    }
  }, [address, cid])

  return (
    <Modal
      visible
      okText="Restore"
      onOk={onRestore}
      onCancel={onClose}
      centered
    >
      <Row gutter={[4, 4]}>
        <Space align="baseline">
          <Typography.Text type="warning">
            <IonIcon name="alert-circle-outline" />
          </Typography.Text>
          <Space direction="vertical" size={0}>
            <Typography.Title level={5}>
              Do you want to Restore?
            </Typography.Title>
            <Typography.Text>Some data will be lost.</Typography.Text>
          </Space>
        </Space>
      </Row>
    </Modal>
  )
}

export default ConfirmRestore
