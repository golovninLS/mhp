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
            let kanban = document.createElement("div")
            kanban.classList.add("applications-kanban");

            element.appendChild(kanban);

            element.kanban = kanban;
        },
        update: function (element, controller, list, options) {
//            if (element.drake)
//                element.drake.destroy();
//            element.drake = dragula();

            while (element.kanban.lastElementChild) {
                element.kanban.removeChild(element.kanban.lastElementChild);
            }

            if (options == null || !options.statuses) return;

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
                        applicationsContentCaption.innerHTML = (applications.textPosition ? ("<div class=\"text-secondary\">Специализация: </div>" + "<div>" + applications.textPosition + "</div>") : "") +
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
//                element.drake.containers.push(statusBody);

                element.kanban.appendChild(statusDiv);
            }

//            element.drake.on("drop", function(el, target, source, sibling) {
////                if (el.applications.status !== target.status.id.toString())
////                    controller.changeProperty("status", el.applications, target.status.id);
////                applicationsKanbanReorder(controller, target.children);
//            });

        },
        clear: function (element) {
//            if (element.drake)
//                element.drake.destroy();
        }
    }
}
