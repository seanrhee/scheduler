import React, { useEffect } from "react";
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import useVisualMode from "hooks/useVisualMode"
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import 'components/Appointment/styles.scss'
import Form from "./Form";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CANCEL = "CANCEL";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE"
 
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch((error) => transition(ERROR_SAVE, true))
  }

  function cancel() {
    transition(CANCEL, true)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch((error) => transition(ERROR_DELETE, true))
  }

  function confirm() {
    transition(CONFIRM)
  }

  function edit() {
    transition(EDIT)
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === CANCEL && <Status message="Deleting"/> }
      {mode === CONFIRM && <Confirm onCancel={back} onConfirm={cancel} message="are you sure you would like to delete?"/>}
      {mode === EDIT && (
        <Form
          student={props.student ? props.student : props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment."
          onClose={back}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appointment."
          onClose={back}
        />
      )}
    </article>
  )
}