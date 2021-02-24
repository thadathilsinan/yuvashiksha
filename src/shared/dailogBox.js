/**
 * THIS IS THE SHARED HELPER FUNCTION TO DISPLAY MODALS IN COMPONENTS
 *
 *TO TOGGLE THE MODAL YOU NEED TO CREATE A BUTTON WITH ATTRIBUTES
    data-target="#name of modal"    //# + name_of_modal
    data-toggle="modal"


    EXAMPLE USAGE:-

    //Button implementation
    <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
    >
        Show Modal
    </button>

    //Javascript Part.THIS MUST BE IN render() method of the React component
    {configuireDialogBox(
        "exampleModal",     //Name of modal
        "Message",          //Title of modal
        <p>Hi</p>,          //Body
        <p>Footer</p>       //Footer
    )}
 */

/**
 * This function returns the JSX for rendering the modal in the browser
 *
 * @param   {String}  modalName    The name of the modal. This must be a unique name
 * @param   {String}  modalTitle   The title of the modal
 * @param   {JSX}  modalBody    The body content of the modal
 * @param   {JSX}  modalFooter  The footer part of the modal
 *
 * @return  {JSX}               The content to render modal in the screen
 */
let configuireDialogBox = (modalName, modalTitle, modalBody, modalFooter) => {
  return (
    <div
      class="modal fade"
      id={`${modalName}`}
      tabindex="-1"
      aria-labelledby={`${modalName}ModalLabel`}
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id={`${modalName}ModalLabel`}>
              {modalTitle}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">{modalBody}</div>
          <div class="modal-footer">{modalFooter}</div>
        </div>
      </div>
    </div>
  );
};

export default configuireDialogBox;
