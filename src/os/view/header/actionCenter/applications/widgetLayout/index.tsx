import { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Row, Col, Button } from 'antd'
import AppIcon from 'os/components/appIcon'
import DroppablePage from './droppablePage'
import DraggableIcon from './draggableIcon'

import { RootDispatch } from 'os/store'
import { setActionCenterVisible } from 'os/store/ui.reducer'
import DraggableAction from './draggableAction'
import IonIcon from 'shared/ionicon'

// Mixed Strategy
const mixedStrategy = (
  ...args: Parameters<typeof rectIntersection | typeof closestCorners>
) => {
  const intersecting = rectIntersection(...args)
  return intersecting ? intersecting : closestCorners(...args)
}

type Props = {
  disabled?: boolean
  appIds: AppIds
  onChange: (appIds: AppIds) => void
  onRemove?: (appId: string) => void
  removeLabel?: string
  onAdd?: () => void
  addLabel?: string
}

const WidgetLayout = (props: Props) => {
  const {
    disabled = true,
    appIds,
    onChange,
    onRemove,
    removeLabel,
    onAdd,
    addLabel,
  } = props
  const history = useHistory()
  const dispatch = useDispatch<RootDispatch>()
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [internalAppIds, setInternalPages] = useState<AppIds>([])
  const [activeId, setActiveId] = useState<string>('')
  const [action, setAction] = useState('')

  useEffect(() => {
    setInternalPages(appIds)
  }, [appIds])

  const open = async (appId: string) => {
    await dispatch(setActionCenterVisible(false))
    return history.push(`/app/${appId}`)
  }

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(active.id)
  const onDragOver = useCallback(
    ({ over, active }: DragOverEvent) => {
      // Remove an app
      if (over?.id?.startsWith('action-')) return setAction(over.id)
      else setAction('')
      // Sort apps
      const activeAppIndex = active.id
      const overAppIndex = over?.id || activeAppIndex
      // Sort the page
      const newAppIds = arrayMove(
        internalAppIds,
        internalAppIds.indexOf(activeAppIndex),
        internalAppIds.indexOf(overAppIndex),
      )
      // Update new pages
      return setInternalPages(newAppIds)
    },
    [internalAppIds],
  )

  const handleRemove = ({ over, active }: DragEndEvent): boolean => {
    if (!onRemove || over?.id !== 'action-remove') return false

    const activeId = active.id
    const newInternalAppIds = internalAppIds.filter(
      (appId) => appId !== activeId,
    )
    setInternalPages(newInternalAppIds)
    onRemove(activeId)
    return true
  }

  const onDragEnd = async (event: DragEndEvent) => {
    if (activeId) setActiveId('') // Disable button action after drag
    if (handleRemove(event)) return
    return onChange(internalAppIds)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mixedStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <DroppablePage index={0} items={internalAppIds} disabled={disabled}>
            {internalAppIds.map((appId) => (
              <DraggableIcon
                key={appId}
                appId={appId}
                disabled={disabled}
                size={64}
                onClick={() => open(appId)}
              />
            ))}
          </DroppablePage>
        </Col>
        {!disabled && (
          <Fragment>
            {onRemove && appIds.length ? (
              <Col span={onAdd ? 12 : 24}>
                <DraggableAction id="action-remove">
                  <Button
                    block
                    disabled={!activeId}
                    type={action ? 'primary' : undefined}
                    className="contained"
                    icon={<IonIcon name="trash-outline" />}
                  >
                    {removeLabel}
                  </Button>
                </DraggableAction>
              </Col>
            ) : null}
            {onAdd && (
              <Col span={onRemove ? 12 : 24}>
                <Button
                  block
                  className="contained"
                  icon={<IonIcon name="add-outline" />}
                  onClick={onAdd}
                >
                  {addLabel}
                </Button>
              </Col>
            )}
          </Fragment>
        )}
      </Row>
      <DragOverlay>
        {activeId ? (
          <span style={{ opacity: 0.5 }}>
            <AppIcon appId={activeId} />
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetLayout
