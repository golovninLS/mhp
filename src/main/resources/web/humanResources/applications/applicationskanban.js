function applicationsKanbanReorder(controller, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].applications && elements[i].applications.order !== undefined && elements[i].applications.order !== i) {
            controller.changeProperty("order", elements[i].applications, i);
        }
    }
}

function createStatusStat(header, text) {
    let statusStat = document.createElement("div");
    statusStat.classList.add("project-kanban-status-budget");
    statusStat.innerHTML = text;
    header.appendChild(statusStat);
}

function createApplicationsCard(applications) {
    let applicationsCard = document.createElement("div");
    applicationsCard.classList.add("applications-kanban-card", "card");

    if (applications.idBackground) {
        applicationsCard.classList.add("text-bg-" + applications.idBackground);
    }

    if (applications.subject) {
        let applicationsHeader = document.createElement("h5");
        applicationsHeader.classList.add("applications-kanban-card-header", "card-header");
        applicationsHeader.innerHTML = applications.subject;
        applicationsCard.appendChild(applicationsHeader);
    }

    let applicationsContent = document.createElement("ul");
    applicationsContent.classList.add("applications-kanban-card-content", "list-group", "list-group-flush");
    applicationsCard.appendChild(applicationsContent);

    let applicationsBody = document.createElement("il");
    applicationsBody.classList.add("applications-kanban-card-body", "list-group-item");
    applicationsContent.appendChild(applicationsBody);

    if (applications.firstName) {
        let applicationsFirstName = document.createElement("h6");
        applicationsFirstName.classList.add("applications-kanban-card-author", "card-title", "text-body-secondary");
        applicationsFirstName.innerHTML = applications.firstName;
        applicationsBody.appendChild(applicationsFirstName);
    }

    let applicationsContentCaption = document.createElement("li");
    applicationsContentCaption.classList.add("applications-kanban-card-assigned-to", "list-group-item");
    applicationsContentCaption.innerHTML =
        (applications.source ? `<div class="text-secondary">Источник: </div><div>${applications.source}</div>` : "") +
        (applications.companyName ? `<div class="text-secondary">Компания: </div><div>${applications.companyName}</div>` : "") +
        (applications.textPosition ? `<div class="text-secondary">Специализация: </div><div>${applications.textPosition}</div>` : "") +
        (applications.currentViza ? `<div class="text-secondary">Виза: </div><div>${applications.currentViza}</div>` : "") +
        (applications.phone ? `<div class="text-secondary">Телефон: </div><div>${applications.phone}</div>` : "") +
        (applications.channelComunication ? `<div class="text-secondary">Канал: </div><div>${applications.channelComunication}</div>` : "");
    applicationsContent.appendChild(applicationsContentCaption);

    if (applications.deadline) {
        let applicationsDeadline = document.createElement("div");
        applicationsDeadline.classList.add("applications-kanban-card-deadline", "card-footer");
        applicationsDeadline.innerHTML = applications.deadline;
        applicationsCard.appendChild(applicationsDeadline);
    }

    if (applications.captionContact) {
        let applicationsContentContact = document.createElement("div");
        applicationsContentContact.classList.add("applications-kanban-card-deadline", "card-footer");
        applicationsContentContact.innerHTML = applications.captionContact;
        applicationsCard.appendChild(applicationsContentContact);
    }

    applicationsCard.applications = applications;
    return applicationsCard;
}

function createCompanyContainer(name, options) {
    let statusDiv = document.createElement("div");
    statusDiv.classList.add("applications-kanban-status");
    statusDiv.classList.add("border-start");

    let statusHeader = document.createElement("div");
    statusHeader.classList.add("applications-kanban-status-header");
    statusDiv.appendChild(statusHeader);

    let statusName = document.createElement("div");
    statusName.classList.add("applications-kanban-status-name");
    statusName.classList.add("h5");

    let statusBody = document.createElement("div");
    statusBody.classList.add("applications-kanban-status-body");

    if (name == 'mhp') {
        statusName.innerHTML = options.mhp.amount;
        statusHeader.appendChild(statusName);

        let mhpBody = document.createElement("div");
        mhpBody.classList.add("companies");
        statusBody.appendChild(mhpBody);
        statusBody.mhpBody = mhpBody;

    } else {
        statusName.innerHTML = options.sah.amount;
        statusHeader.appendChild(statusName);

        let sahBody = document.createElement("div");
        sahBody.classList.add("companies");
        statusBody.appendChild(sahBody);
        statusBody.sahBody = sahBody;
    }

    statusDiv.appendChild(statusBody);
    statusDiv.statusBody = statusBody;

    return statusDiv;
}

function applicationsKanban() {
    return {
        render: function (element, controller) {
            let mainField = document.createElement("div");
            mainField.classList.add("mainField");
            element.appendChild(mainField);
            element.mainField = mainField;

            let kanban = document.createElement("div");
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
                invalid: function (el, handle) {
                    return el.closest('.companies') !== null;
                }
            });

            while (element.kanban.lastElementChild) {
                element.kanban.removeChild(element.kanban.lastElementChild);
            }

            if (options == null || !options.statuses) return;

            element.acceptButton.innerHTML = options.nameHired.name;
            element.declineButton.innerHTML = options.nameRefused.name;

            let statusDiv1 = createCompanyContainer('mhp', options);
            let statusDiv2 = createCompanyContainer('sah', options);

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
                    createStatusStat(statusHeader, status.stat);
                }

                //                statusNew.addEventListener("click", function() {
                //                    controller.changeProperty("createapplications", null, status.id);
                //                });

                let statusBody = document.createElement("div");
                statusBody.classList.add("applications-kanban-status-body");

                for (const applications of list)
                    if (applications.status === status.id.toString()) {
                        if (applications.companyEmployee !== undefined && applications.companyEmployee == 1) {
                            let applicationsCard = createApplicationsCard(applications);
                            statusDiv1.statusBody.mhpBody.appendChild(applicationsCard);

                            applicationsCard.addEventListener("click", function () {
                                controller.changeObject(applications, true, applicationsCard);
                            });
                        } else if (applications.companyEmployee !== undefined && applications.companyEmployee == 2) {
                            let applicationsCard = createApplicationsCard(applications);
                            statusDiv2.statusBody.sahBody.appendChild(applicationsCard);

                            applicationsCard.addEventListener("click", function () {
                                controller.changeObject(applications, true, applicationsCard);
                            });
                        } else {
                            let applicationsCard = createApplicationsCard(applications);
                            statusBody.appendChild(applicationsCard);

                            applicationsCard.addEventListener("click", function () {
                                controller.changeObject(applications, true, applicationsCard);
                            });
                        }
                    }
                statusDiv.appendChild(statusBody);
                statusBody.status = status;
                element.statusBody = statusBody;
                if (status.nameStatus.trim() !== "Нанят") element.kanban.appendChild(statusDiv);
                element.drake.containers.push(statusBody);
            }

            element.kanban.appendChild(statusDiv1);
            element.kanban.appendChild(statusDiv2);

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
                } else if (target === element.declineButton) {
                    controller.changeProperty("refuse", el.applications);
                    source.appendChild(el);
                } else if (target && target.querySelector('.companies')) {
                    element.drake.cancel(true);
                    return;
                } else if (el.applications.status !== target.status.id.toString()) {
                    controller.changeProperty("status", el.applications, target.status.id);
                    applicationsKanbanReorder(controller, target.children);
                }
            });
        },
        clear: function (element) {
            if (element.drake) element.drake.destroy();
        }
    }
}