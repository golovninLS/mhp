function applicationsKanbanReorder(controller, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].applications.currentOrder !== i) {
            controller.changeProperty("currentOrder", elements[i].applications, i);
        }
    }
}
function applicationsKanban() {
    return {
        render: function (element, controller) {
            let mainField = document.createElement("div")
            mainField.classList.add("mainField");
            element.appendChild(mainField);
            element.mainField = mainField;

            let kanban = document.createElement("div")
            kanban.classList.add("applications-kanban");
            mainField.appendChild(kanban);
            element.kanban = kanban;

            let actionContainer = document.createElement("div");
            actionContainer.classList.add("kanban-action-container");
            mainField.appendChild(actionContainer);

            let declineButton = document.createElement("div");
            declineButton.classList.add("btn", "btn-danger", "me-2");
            declineButton.classList.add("actionButton");
            actionContainer.appendChild(declineButton);

            let acceptButton = document.createElement("div");
            acceptButton.classList.add("btn", "btn-success");
            acceptButton.classList.add("actionButton");
            actionContainer.appendChild(acceptButton);

            element.actionContainer = actionContainer;
            element.acceptButton = acceptButton;
            element.declineButton = declineButton;
        },
        update: function (element, controller, list, options) {
            if (element.drake) element.drake.destroy();
             element.drake = dragula({
                 copy: false,
                 revertOnSpill: true,
                 accepts: function (el, target) {
                     return target === element.acceptButton || target === element.declineButton;
                 }
             });

            while (element.kanban.lastElementChild) {
                element.kanban.removeChild(element.kanban.lastElementChild);
            }

            if (options == null || !options.statuses) return;

            element.acceptButton.innerHTML = options.nameHired.name;
            element.declineButton.innerHTML = options.nameRefused.name;

            for (const status of options.statuses) {
                let statusDiv = document.createElement("div")
                statusDiv.classList.add("applications-kanban-status");
                if (status !== options.statuses[0])
                    statusDiv.classList.add("border-start");

                let statusHeader = document.createElement("div");
                statusHeader.classList.add("applications-kanban-status-header");
                statusDiv.appendChild(statusHeader);

                let statusName = document.createElement("div");
                statusName.classList.add("applications-kanban-status-name");
                statusName.classList.add("h5");
                statusName.innerHTML = status.name;
                statusHeader.appendChild(statusName);

//                let statusNew = document.createElement("button");
//                statusNew.classList.add("applications-kanban-status-new");
//                statusNew.classList.add("btn");
//                statusNew.classList.add("btn-light");
//                statusNew.innerHTML = "<i class=\"bi bi-plus\"></i>";
//                statusHeader.appendChild(statusNew);
                if (status.stat) {
                    let statusStat = document.createElement("div");
                    statusStat.classList.add("project-kanban-status-budget");
                    statusStat.innerHTML = status.stat;
                    statusHeader.appendChild(statusStat);
                }

//                statusNew.addEventListener("click", function() {
//                    controller.changeProperty("createapplications", null, status.id);
//                });

                let statusBody = document.createElement("div");
                statusBody.classList.add("applications-kanban-status-body");

                for (const applications of list)
                    if (applications.status === status.id.toString()) {
                        let applicationsCard = document.createElement("div");
                        applicationsCard.classList.add("applications-kanban-card");
                        applicationsCard.classList.add("card");
                        if (applications.idColorPriority)
                            applicationsCard.classList.add("text-bg-" + applications.idColorPriority);

                        applicationsCard.addEventListener("click", function() {
                            controller.changeObject(applications, true, applicationsCard);
                        });

                        if (applications.subject) {
                            let applicationsHeader = document.createElement("h5");
                            applicationsHeader.classList.add("applications-kanban-card-header");
                            applicationsHeader.classList.add("card-header");
                            applicationsHeader.innerHTML = applications.subject;
                            applicationsCard.appendChild(applicationsHeader);
                        }

                        let applicationsContent = document.createElement("ul");
                        applicationsContent.classList.add("applications-kanban-card-content");
                        applicationsContent.classList.add("list-group");
                        applicationsContent.classList.add("list-group-flush");
                        applicationsCard.appendChild(applicationsContent);

                        let applicationsBody = document.createElement("il");
                        applicationsBody.classList.add("applications-kanban-card-body");
                        applicationsBody.classList.add("list-group-item");
                        applicationsContent.appendChild(applicationsBody);

                        if (applications.firstName) {
                            let applicationsFirstName = document.createElement("h6");
                            applicationsFirstName.classList.add("applications-kanban-card-author");
                            applicationsFirstName.classList.add("card-title");
                            applicationsFirstName.classList.add("text-body-secondary");
                            applicationsFirstName.innerHTML = applications.firstName;
                            applicationsBody.appendChild(applicationsFirstName);
                        }

                        let applicationsContentCaption = document.createElement("li");
                        applicationsContentCaption.classList.add("applications-kanban-card-assigned-to");
                        applicationsContentCaption.classList.add("list-group-item");
                        applicationsContentCaption.innerHTML = (applications.textPosition ? ("<div class=\"text-secondary\">Компания: </div>" + "<div>" + applications.companyName + "</div>") : "") +
                                                               (applications.textPosition ? ("<div class=\"text-secondary\">Специализация: </div>" + "<div>" + applications.textPosition + "</div>") : "") +
                                                               (applications.currentViza ? ("<div class=\"text-secondary\">Виза: </div>" + "<div>" + applications.currentViza + "</div>") : "") +
                                                               (applications.phone ? ("<div class=\"text-secondary\">Телефон</div>" + "<div>" + applications.phone + "</div>") : "") +
                                                               (applications.channelComunication ? ("<div class=\"text-secondary\">Канал</div>" + "<div>" + applications.channelComunication + "</div>") : "")
                                                               ;
                        applicationsContent.appendChild(applicationsContentCaption);

                        if (applications.deadline) {
                            let applicationsDeadline = document.createElement("div");
                            applicationsDeadline.classList.add("applications-kanban-card-deadline");
                            applicationsDeadline.classList.add("card-footer");
                            applicationsDeadline.innerHTML = (applications.deadline);
                            applicationsCard.appendChild(applicationsDeadline);
                        }

                        if (applications.captionContact) {
                            let applicationsContentContact = document.createElement("div");
                            applicationsContentContact.classList.add("applications-kanban-card-deadline");
                            applicationsContentContact.classList.add("card-footer");
                            applicationsContentContact.innerHTML = (applications.captionContact);
                            applicationsCard.appendChild(applicationsContentContact);
                        }

                        applicationsCard.applications = applications;
                        statusBody.appendChild(applicationsCard);
                    }

                statusDiv.appendChild(statusBody);
                statusBody.status = status;
                element.kanban.appendChild(statusDiv);

                element.drake.containers.push(statusBody);
            }

            element.drake.containers.push(element.acceptButton);
            element.drake.containers.push(element.declineButton);

            element.drake.on("drag", function (el) {
                element.actionContainer.classList.add("visible");
            });

            element.drake.on("dragend", function () {
                element.actionContainer.classList.remove("visible");
            });

            element.drake.on("drop", function (el, target, source) {
                const id = el.applications["#__key"].e.a;
                if (target === element.acceptButton) {
                    controller.changeProperty("hire", el.applications);
                    source.appendChild(el);
                } else
                if (target === element.declineButton) {
                    controller.changeProperty("refuse", el.applications);
                    source.appendChild(el);
                }
            });

//            element.drake.on("drop", function(el, target, source, sibling) {
////                if (el.applications.status !== target.status.id.toString())
////                    controller.changeProperty("status", el.applications, target.status.id);
////                applicationsKanbanReorder(controller, target.children);
//            });

        },
        clear: function (element) {
            if (element.drake) element.drake.destroy();
        }
    }
}
