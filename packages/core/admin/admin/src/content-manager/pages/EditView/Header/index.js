import React, { memo, useRef, useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Link } from '@strapi/design-system/Link';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import Check from '@strapi/icons/Check';
import PropTypes from 'prop-types';
import isEqualFastCompare from 'react-fast-compare';
import { getTrad } from '../../../utils';
import { connect, getDraftRelations, select } from './utils';

const Header = ({
  allowedActions: { canUpdate, canCreate, canPublish },
  componentLayouts,
  initialData,
  isCreatingEntry,
  isSingleType,
  hasDraftAndPublish,
  layout,
  modifiedData,
  onPut,
  onPublish,
  onUnpublish,
  status,
}) => {
  const { goBack } = useHistory();
  const [showWarningUnpublish, setWarningUnpublish] = useState(false);
  const [showWarningDraftRelation, setShowWarningDraftRelation] = useState(false);
  const [showTimeSelectPublish, setShowTimeSelectPublish] = useState(false);
  const [showRejectMessageInput, setShowRejectMessageInput] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showTimeSelectArchive, setShowTimeSelectArchive] = useState(false);
  const [autoArchive, setAutoArchive] = useState(false);
  const [publishDateTime, setPublishDateTime] = useState(new Date());
  const [archiveDateTime, setArchiveDateTime] = useState(new Date());
  const [rejectMessage, setRejectMessage] = useState(initialData.rejectMessage ?? '');
  const { formatMessage } = useIntl();
  const draftRelationsCountRef = useRef(0);

  const currentContentTypeMainField = get(layout, ['settings', 'mainField'], 'id');
  const currentContentTypeName = get(layout, ['info', 'displayName'], 'NOT FOUND');
  const didChangeData =
    !isEqual(initialData, modifiedData) || (isCreatingEntry && !isEmpty(modifiedData));

  const createEntryIntlTitle = formatMessage({
    id: getTrad('containers.Edit.pluginHeader.title.new'),
    defaultMessage: 'Create an entry',
  });

  let title = createEntryIntlTitle;

  if (!isCreatingEntry && !isSingleType) {
    title = initialData[currentContentTypeMainField] || currentContentTypeName;
  }

  if (isSingleType) {
    title = currentContentTypeName;
  }

  const checkIfHasDraftRelations = () => {
    const count = getDraftRelations(modifiedData, layout, componentLayouts);

    draftRelationsCountRef.current = count;

    return count;
  };

  const changeStage = stage => {
    switch (stage) {
      case 'publish':
        onPut(
          {
            ...initialData,
            stage,
            publishDate: null,
            schedulePublishDate: Math.floor(publishDateTime.getTime() / 1000).toString(),
            scheduleArchiveDate: autoArchive
              ? Math.floor(archiveDateTime.getTime() / 1000).toString()
              : null,
          },
          {}
        );
        break;
      case 'submitted':
        onPut({ ...initialData, stage, schedulePublishDate: null }, {});
        break;
      case 'reject':
        onPut({ ...initialData, stage: 'draft', rejectMessage }, {});
        break;
      case 'archive':
        onPut(
          {
            ...initialData,
            scheduleArchiveDate: Math.floor(archiveDateTime.getTime() / 1000).toString(),
          },
          {}
        );
        break;
      case 'cancle-archive':
        onPut(
          {
            ...initialData,
            scheduleArchiveDate: null,
          },
          {}
        );
        break;
      default:
        break;
    }
  };

  let primaryAction = null;

  if (isCreatingEntry && canCreate) {
    primaryAction = (
      <Stack horizontal size={2}>
        {/* {hasDraftAndPublish && (
          <Button disabled startIcon={<Check />} variant="secondary">
            {formatMessage({ id: 'app.utils.publish', defaultMessage: 'Publish' })}
          </Button>
        )} */}
        <Button
          variant="success-light"
          disabled={!didChangeData}
          isLoading={status === 'submit-pending'}
          type="submit"
        >
          {formatMessage({
            id: getTrad('containers.Edit.submit'),
            defaultMessage: 'Save',
          })}
        </Button>
      </Stack>
    );
  }

  if (!isCreatingEntry && canUpdate) {
    const shouldShowPublishButton = hasDraftAndPublish && canPublish;
    const isPublished = !isEmpty(initialData.publishedAt);
    const isPublishButtonLoading = isPublished
      ? status === 'unpublish-pending'
      : status === 'publish-pending';
    const pubishButtonLabel = isPublished
      ? { id: 'app.utils.unpublish', defaultMessage: 'Unpublish' }
      : { id: 'app.utils.publish', defaultMessage: 'Publish' };
    // /* eslint-disable indent */
    // const onClick = isPublished
    //   ? () => setWarningUnpublish(true)
    //   : () => {
    //       if (checkIfHasDraftRelations() === 0) {
    //         onPublish();
    //       } else {
    //         setShowWarningDraftRelation(true);
    //       }
    //     };
    // /* eslint-enable indent */

    // ["default","tertiary","secondary","danger","success","ghost","success-light","danger-light"].

    primaryAction = (
      <Flex>
        {(!initialData.stage ||
          initialData?.stage === 'draft' ||
          initialData?.stage === 'published') && (
          <Box paddingLeft={2}>
            <Button
              variant="success-light"
              disabled={!didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => onPut({ ...modifiedData, stage: 'draft' }, {})}
            >
              {formatMessage({
                id: getTrad('containers.Edit.submit'),
                defaultMessage: 'Save',
              })}
            </Button>
          </Box>
        )}
        {initialData?.stage === 'draft' && (
          <Box paddingLeft={2}>
            <Button
              variant="secondary"
              disabled={didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => setShowSubmitConfirmation(true)}
            >
              Submit
            </Button>
          </Box>
        )}
        {initialData?.stage === 'submitted' && (
          <Box paddingLeft={2}>
            <Button
              variant="danger-light"
              disabled={didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => setShowRejectMessageInput(true)}
            >
              Reject
            </Button>
          </Box>
        )}
        {initialData?.stage === 'submitted' && (
          <Box paddingLeft={2}>
            <Button
              variant="success"
              disabled={didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => setShowTimeSelectPublish(true)}
            >
              Publish
            </Button>
          </Box>
        )}
        {initialData?.stage === 'publish' && (
          <Box paddingLeft={2}>
            <Button
              variant="danger-light"
              disabled={didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => changeStage('submitted')}
            >
              Cancel Publis Schedule
            </Button>
          </Box>
        )}
        {initialData?.publishedDate &&
          !initialData?.scheduleArchiveDate &&
          !initialData?.archivedDate && (
            <Box paddingLeft={2}>
              <Button
                variant="danger-light"
                disabled={didChangeData}
                loading={status === 'submit-pending'}
                onClick={() => setShowTimeSelectArchive(true)}
              >
                Archive
              </Button>
            </Box>
          )}
        {initialData?.scheduleArchiveDate && !initialData?.archivedDate && (
          <Box paddingLeft={2}>
            <Button
              variant="danger-light"
              disabled={didChangeData}
              loading={status === 'submit-pending'}
              onClick={() => changeStage('cancle-archive')}
            >
              Cancel Archive Schedule
            </Button>
          </Box>
        )}
        {/* {shouldShowPublishButton && (
          <Button
            disabled={didChangeData}
            loading={isPublishButtonLoading}
            onClick={onClick}
            startIcon={<Check />}
            variant="secondary"
          >
            {formatMessage(pubishButtonLabel)}
          </Button>
        )} */}
      </Flex>
    );
  }

  const toggleWarningUnpublish = () => setWarningUnpublish(prevState => !prevState);
  const toggleWarningDraftRelation = () => setShowWarningDraftRelation(prevState => !prevState);
  const toggleTimeSelectPublish = () => setShowTimeSelectPublish(prevState => !prevState);
  const toggleRejectMessageInput = () => setShowRejectMessageInput(prevState => !prevState);
  const toggleSubmitConfirmation = () => setShowSubmitConfirmation(prevState => !prevState);
  const toggleTimeSelectArchive = () => setShowTimeSelectArchive(prevState => !prevState);

  const handlePublish = () => {
    toggleWarningDraftRelation();
    draftRelationsCountRef.current = 0;
    onPublish();
  };

  const handleUnpublish = () => {
    toggleWarningUnpublish();
    onUnpublish();
  };

  const subtitle = `${formatMessage({
    id: getTrad('api.id'),
    defaultMessage: 'API ID ',
  })} : ${layout.apiID}`;

  // eslint-disable-next-line react/prop-types
  const DateTimeBtn = forwardRef(({ value, onClick }, ref) => (
    // eslint-disable-next-line react/button-has-type
    <Button style={{ margin: 'auto' }} variant="tertiary" onClick={onClick} ref={ref}>
      {value}
    </Button>
  ));

  return (
    <>
      <HeaderLayout
        title={title.toString()}
        primaryAction={primaryAction}
        subtitle={subtitle}
        navigationAction={
          <Link
            startIcon={<ArrowLeft />}
            // Needed in order to redirect the user with the correct search params
            // Since parts is using a link from react-router-dom the best way to do it is to disable the
            // event
            onClick={e => {
              e.preventDefault();
              goBack();
            }}
            to="/"
          >
            {formatMessage({
              id: 'app.components.HeaderLayout.link.go-back',
              defaultMessage: 'Back',
            })}
          </Link>
        }
      />
      {showWarningUnpublish && (
        <Dialog
          onClose={toggleWarningUnpublish}
          title="Confirmation"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showWarningUnpublish}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  {formatMessage(
                    {
                      id: getTrad('popUpWarning.warning.unpublish'),
                      defaultMessage:
                        'Unpublish this content will automatically change it to a draft.',
                    },
                    {
                      br: () => <br />,
                    }
                  )}
                </Typography>
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  {formatMessage({
                    id: getTrad('popUpWarning.warning.unpublish-question'),
                    defaultMessage: 'Are you sure you want to unpublish it?',
                  })}
                </Typography>
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleWarningUnpublish} variant="tertiary">
                {formatMessage({
                  id: 'components.popUpWarning.button.cancel',
                  defaultMessage: 'No, cancel',
                })}
              </Button>
            }
            endAction={
              <Button variant="danger-light" onClick={handleUnpublish}>
                {formatMessage({
                  id: 'components.popUpWarning.button.confirm',
                  defaultMessage: 'Yes, confirm',
                })}
              </Button>
            }
          />
        </Dialog>
      )}

      {showTimeSelectPublish && (
        <Dialog
          onClose={toggleTimeSelectPublish}
          title="Public Schedule"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showTimeSelectPublish}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  Select publish time <br /> Planning can cancel while waiting for publish.
                </Typography>
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <DatePicker
                  selected={publishDateTime}
                  onChange={date => setPublishDateTime(date)}
                  showTimeSelect
                  minDate={new Date()}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={<DateTimeBtn />}
                />
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Checkbox
                  onValueChange={() => setAutoArchive(!autoArchive)}
                  value={autoArchive}
                  aria-label="Set end time"
                  name="Set end time"
                >
                  {autoArchive ? 'TO ↓' : 'Set end time'}
                </Checkbox>
              </Flex>
              {autoArchive && (
                <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                  <DatePicker
                    selected={archiveDateTime}
                    onChange={date => setArchiveDateTime(date)}
                    minDate={publishDateTime}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<DateTimeBtn />}
                  />
                </Flex>
              )}
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleTimeSelectPublish} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="success-light"
                onClick={() => {
                  changeStage('publish');
                  toggleTimeSelectPublish();
                }}
              >
                Publish
              </Button>
            }
          />
          x
        </Dialog>
      )}

      {showTimeSelectArchive && (
        <Dialog
          onClose={toggleTimeSelectArchive}
          title="Archive Schedule"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showTimeSelectArchive}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  Select archive time <br /> Planning can cancel before archived.
                </Typography>
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <DatePicker
                  selected={archiveDateTime}
                  onChange={date => setArchiveDateTime(date)}
                  showTimeSelect
                  minDate={new Date()}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={<DateTimeBtn />}
                />
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleTimeSelectArchive} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="success-light"
                onClick={() => {
                  changeStage('archive');
                  toggleTimeSelectArchive();
                }}
              >
                Archive
              </Button>
            }
          />
        </Dialog>
      )}

      {showRejectMessageInput && (
        <Dialog
          onClose={toggleRejectMessageInput}
          title="Reject"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showRejectMessageInput}
        >
          <DialogBody>
            <Stack size={2}>
              <Flex justifyContent="start" style={{ textAlign: 'left' }}>
                Message:
              </Flex>
              <Flex
                justifyContent="center"
                style={{ textAlign: 'center' }}
                onChange={event => setRejectMessage(event.target.value)}
              >
                <textarea
                  value={rejectMessage}
                  style={{ resize: 'none', whiteSpace: 'pre-wrap' }}
                  rows="8"
                  cols="50"
                />
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleRejectMessageInput} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="danger-light"
                onClick={() => {
                  changeStage('reject');
                  toggleRejectMessageInput();
                }}
              >
                Reject
              </Button>
            }
          />
        </Dialog>
      )}

      {showSubmitConfirmation && (
        <Dialog
          onClose={toggleSubmitConfirmation}
          title="Submit"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showSubmitConfirmation}
        >
          <DialogBody>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                Submit for approvement?
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleSubmitConfirmation} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="secondary"
                onClick={() => {
                  changeStage('submitted');
                  toggleSubmitConfirmation();
                }}
              >
                Submit
              </Button>
            }
          />
        </Dialog>
      )}

      {showWarningDraftRelation && (
        <Dialog
          onClose={toggleWarningDraftRelation}
          title="Confirmation"
          labelledBy="confirmation"
          describedBy="confirm-description"
          isOpen={showWarningDraftRelation}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Stack size={2}>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  {draftRelationsCountRef.current}
                  {formatMessage(
                    {
                      id: getTrad(`popUpwarning.warning.has-draft-relations.message`),
                      defaultMessage:
                        '<b>{count, plural, =0 { of your content relations is} one { of your content relations is} other { of your content relations are}}</b> not published yet.<br></br>It might engender broken links and errors on your project.',
                    },
                    {
                      br: () => <br />,
                      b: chunks => <Typography fontWeight="bold">{chunks}</Typography>,
                      count: draftRelationsCountRef.current,
                    }
                  )}
                </Typography>
              </Flex>
              <Flex justifyContent="center" style={{ textAlign: 'center' }}>
                <Typography id="confirm-description">
                  {formatMessage({
                    id: getTrad('popUpWarning.warning.publish-question'),
                    defaultMessage: 'Do you still want to publish it?',
                  })}
                </Typography>
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={toggleWarningDraftRelation} variant="tertiary">
                {formatMessage({
                  id: 'components.popUpWarning.button.cancel',
                  defaultMessage: 'No, cancel',
                })}
              </Button>
            }
            endAction={
              <Button variant="success" onClick={handlePublish}>
                {formatMessage({
                  id: getTrad('popUpwarning.warning.has-draft-relations.button-confirm'),
                  defaultMessage: 'Yes, publish',
                })}
              </Button>
            }
          />
        </Dialog>
      )}
    </>
  );
};

Header.propTypes = {
  allowedActions: PropTypes.shape({
    canUpdate: PropTypes.bool.isRequired,
    canCreate: PropTypes.bool.isRequired,
    canPublish: PropTypes.bool.isRequired,
  }).isRequired,
  componentLayouts: PropTypes.object.isRequired,
  initialData: PropTypes.object.isRequired,
  isCreatingEntry: PropTypes.bool.isRequired,
  isSingleType: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
  hasDraftAndPublish: PropTypes.bool.isRequired,
  modifiedData: PropTypes.object.isRequired,
  onPut: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onUnpublish: PropTypes.func.isRequired,
};

const Memoized = memo(Header, isEqualFastCompare);

export default connect(Memoized, select);
export { Header };
