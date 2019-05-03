const TelegramBot = require('node-telegram-bot-api');
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const assert = require('assert');

const token = '<INSERIRE TOKEN TELEGRAM BOT>';
/* Costanti database */
const uri = "<INSERIRE URI MONGODB>";
const dbName = 'tg-bot';

const COLLECTION_USER_PREF = 'user-pref';
const COLLECTION_TASK = 'tasks';

/* Connessione MongoDB */
/**
 * Callback connessione al db
 * 
 * @callback dbConnectedCallback
 * @param {Mongo.MongoClient} client
 * @param {Mongo.Db} db
 */

/**
 * Connette al database, poi ritorna il db alla callback
 * 
 * @param {dbConnectedCallback} callback 
 */
var Connect = function (callback) {
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect(function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		callback(client, db);
	});
}

/* Costanti bottoni inline */
const SET_LANG = "SL";

const CREATE_TASK = "CT";
const CREATE_TASK_YES = "CTY";
const CREATE_TASK_NO = "CTN";
const CREATE_TASK_WITH_DEADLINE = "CTWD";
const CREATE_TASK_WITHOUT_DEADLINE = "CTOD";

const DELETE_TASK = "DT";
const DELETE_TASK_YES = "DTY";
const DELETE_TASK_NO = "DTN";

const COMPLETE_TASK = "COT";
const UNCOMPLETE_TASK = "UOT";

const JOIN_TASK = "JT";
const UNJOIN_TASK = "UJT";

const SHOW_OPEN_TASK = "SOT";
const SHOW_CLOSED_TASK = "SCT";

const SHOW_NEXT_OPEN_TASK = "SNOT";
const SHOW_NEXT_CLOSED_TASK = "SNCT";

const ADD_ACTIVITY = "AA";
const CREATE_ACTIVITY_YES = "CAY";
const CREATE_ACTIVITY_NO = "CAN";

/* Emoji lingue */
const flags = {
	'en': '\u{1F1FA}\u{1F1F8}',
	'it': '\u{1F1EE}\u{1F1F9}'
}

/* Traduzioni */
const strings = {
	it: {
		// start
		welcome: flags.it + ' Benvenuto in Task Bot!\nCome prima cosa imposta la lingua con /setlang',

		// setlang
		set_lang: flags.it + ' Seleziona la tua lingua.',
		lang_setted: 'Lingua impostata con successo!',
		lang_error: 'Errore nella selezione della lingua',

		// create task
		create_task: 'Crea task',
		ins_name_task: 'Inserisci il nome della task ("abort" per annullare)',
		abort_create_task: 'Creazione task annullata',
		add_deadline_task_q: 'Vuoi aggiungere una scadenza?',
		ins_deadline: 'Inserisci la data di scadenza (gg/mm/aaaa)',
		confirm_create_task: 'Stai per creare una task con i seguenti parametri:',
		procede_create_task: 'Procedere?',
		task_creation_successfull: 'Task creata correttamente.',
		task_creation_failed: 'Creazione task fallita!',
		task_creation_date: 'Data creazione',

		// delete task
		delete_task: 'Elimina task',
		confirm_delete_chat: 'Sei sicuro di voler eliminare questa task?\nTutti i dati relativi a essa verranno eliminati!',
		delete_task_successfull: 'Task eliminata correttamente.',
		delete_task_failed: 'Eliminazione task fallita!',
		abort_delete_task: 'Eliminazione task annullata.',

		// complete task
		complete_task: 'Segna come chiusa',
		complete_task_ok: 'Task chiusa',
		uncomplete_task: 'Segna come aperta',
		uncomplete_task_ok: 'Task aperta',

		// show task
		show_open_task: 'Mostra task aperte',
		show_closed_task: 'Mostra task chiuse',
		join_task: 'Partecipa alla task',
		unjoin_task: 'Smetti di partecipare alla task',
		joined_task: 'Ora partecipi alla task',
		unjoined_task: 'Ora non partecipi alla task',

		// add activity
		add_activity: 'Aggiungi un\'attività',
		ins_act_start_date: 'Inserisci data e ora di inizio (gg/mm/aaaa hh:mm)',
		ins_act_end_date: 'Inserisci data e ora di fine (gg/mm/aaaa hh:mm)',
		confirm_create_activity: 'Stai per creare un\'attività con i seguenti parametri:',
		procede_create_activity: 'Procedere?',
		activity_created: 'Attività creata con successo',
		abort_create_activity: 'Creazione attività annullata',
		activity_creation_failed: 'Creazione attività fallita!',
		activity_start_date: 'Data inizio',
		activity_end_date: 'Data fine',

		// generic
		yes: 'Si',
		no: 'No',
		invalid_date_format: 'Data in un formato non valido!',
		name: 'Nome',
		deadline: 'Scadenza',
		task: 'Task',
		no_task: 'Nessuna task presente',
		user: 'Utente',
		duration: 'Durata',
		h: 'ore',
		min: 'minuti',
		oreuomo: 'Ore uomo',
	},
	en: {
		// start
		welcome: flags.en + ' Welcome to Task Bot!\nFirst set your language with /setlang',

		// setlang
		set_lang: flags.en + ' Select your lang.',
		lang_setted: 'Language setted!',
		lang_error: 'Error in language selection',

		// create task
		create_task: 'Create task',
		ins_name_task: 'Insert the name of the task ("abort" to cancel)',
		abort_create_task: 'Task creation canceled',
		add_deadline_task_q: 'Do you want to add a deadline?',
		ins_deadline: 'Enter the deadline date (dd/mm/yyyy)',
		confirm_create_task: 'You are about to create a task with the following parameters:',
		procede_create_task: 'It\'s ok?',
		task_creation_successfull: 'Task created successfully.',
		task_creation_failed: 'Task creation failed!',
		task_creation_date: 'Creation date',

		// delete task
		delete_task: 'Delete task',
		confirm_delete_chat: 'Are you sure you want to delete this task?\nAll data related to it will be deleted!',
		delete_task_successfull: 'Task successfully deleted.',
		delete_task_failed: 'Task elimination failed!',
		abort_delete_task: 'Task elimination cancelled.',

		// (un)complete task
		complete_task: 'Mark as closed',
		complete_task_ok: 'Task closed',
		uncomplete_task: 'Mark as open',
		uncomplete_task_ok: 'Task open',

		// show task
		show_open_task: 'Show open tasks',
		show_closed_task: 'Show closed tasks',
		join_task: 'Join to the task',
		unjoin_task: 'Unjoin to the task',
		joined_task: 'Now you partecipate to the task',
		unjoined_task: 'Now you don\'t partecipate to the task',

		// add activity
		add_activity: 'Add activity',
		ins_act_start_date: 'Enter start date and time (dd/mm/yyyy hh:mm)',
		ins_act_end_date: 'Enter end date and time (dd/mm/yyyy hh:mm)',
		confirm_create_activity: 'You are about to create an activity with the following parameters:',
		procede_create_activity: 'It\'s ok?',
		activity_created: 'Activity created successfully',
		abort_create_activity: 'Activity creation canceled',
		activity_creation_failed: 'Activity creation failed!',
		activity_start_date: 'Start date',
		activity_end_date: 'End date',

		// generic
		yes: 'Yes',
		no: 'No',
		invalid_date_format: 'Date in an invalid format!',
		name: 'Name',
		deadline: 'Deadline',
		task: 'Task',
		no_task: 'No tasks present',
		user: 'User',
		duration: 'Duration',
		h: 'hours',
		min: 'minutes',
		oreuomo: 'Man hours',
	}
}

/* Oggetti globali */
/**
 * Oggetto con le preferenze degli utenti
 */
const pref = {};

/**
 * Array con le task in creazione
 */
const task_in_creazione = [];

/**
 * Array con le attività in creazione
 */
const activity_in_creazione = [];

/**
 * @type {TelegramBot}
 */
var bot;

/* Funzioni globali */
/**
 * Inizializza il bot
 */
function initTg() {
	bot = new TelegramBot(token, { polling: true });

	/* Comandi */
	bot.onText(/\/start/, (msg) => {
		bot.sendMessage(msg.chat.id, strings.en.welcome + "\n\n" + strings.it.welcome);
	});

	bot.onText(/\/setlang/, (msg) => {
		try {
			bot.sendMessage(msg.chat.id, strings.en.set_lang + "\n\n" + strings.it.set_lang, {
				"reply_markup": {
					"inline_keyboard":
						[[{ text: flags.en, callback_data: JSON.stringify({ action: SET_LANG, lang: 'en' }) }],
						[{ text: flags.it, callback_data: JSON.stringify({ action: SET_LANG, lang: 'it' }) }]],
				}
			});
		} catch (error) {
			console.log(error);
		}
	});

	bot.onText(/\/menu/, async (msg) => {
		showMenu(msg.chat.id);
	});

	// Logica bottoni inline
	bot.on("callback_query", async (a) => {
		const data = JSON.parse(a.data);
		let chatId = a.message.chat.id;
		let from_user = a.from.id;

		let answer = true;

		switch (data.action) {
			//#region SET_LANG
			case SET_LANG:
				answer = false;

				Connect((client, db) => {
					const up = db.collection(COLLECTION_USER_PREF);
					let doc = { $set: { _id: chatId, lang: data.lang } };
					up.updateOne({ _id: chatId }, doc, { upsert: true }).then(() => {
						bot.answerCallbackQuery(a.id);

						client.close();
						pref[chatId] = { lang: data.lang };
						bot.sendMessage(chatId, GetLocalString(chatId, 'lang_setted'));
						showMenu(chatId);
					}).catch((err) => {
						bot.answerCallbackQuery(a.id);

						let res = flags.en + ' ' + strings.en.lang_error + '\n\n' + flags.it + ' ' + strings.it.lang_error;
						bot.sendMessage(chatId, res);
						console.log(err);
					});
				});
				break;
			//#endregion

			//#region CREATE_TASK
			case CREATE_TASK:
				let msg_get_name = await bot.sendMessage(chatId, GetLocalString(chatId, 'ins_name_task'), {
					"reply_markup": {
						"force_reply": true
					}
				});
				let repId = await bot.onReplyToMessage(chatId, msg_get_name.message_id, (msg_name) => {
					bot.removeReplyListener(repId);

					if (msg_name.text == "abort") {
						bot.sendMessage(chatId, GetLocalString(chatId, 'abort_create_task'));
						return;
					}

					let task = Task.from({ nome: msg_name.text, data_creazione: new Date().toISOString(), chat: chatId, aperta: true, deadline: undefined });

					let i = ID();
					task_in_creazione[i] = task;

					bot.sendMessage(chatId, GetLocalString(chatId, 'add_deadline_task_q'), {
						"reply_markup": {
							"inline_keyboard": [
								[
									{ text: GetLocalString(chatId, 'yes'), callback_data: JSON.stringify({ action: CREATE_TASK_WITH_DEADLINE, task: i }) },
									{ text: GetLocalString(chatId, 'no'), callback_data: JSON.stringify({ action: CREATE_TASK_WITHOUT_DEADLINE, task: i }) }
								]
							],
						}
					});
				})
				break;
			//#endregion

			//#region CREATE_TASK_WITH_DEADLINE
			case CREATE_TASK_WITH_DEADLINE:
				let task_wd = task_in_creazione[data.task];
				if (task_wd) {
					let msg_get_deadline = await bot.sendMessage(chatId, GetLocalString(chatId, 'ins_deadline'), {
						"reply_markup": {
							"force_reply": true
						}
					});
					let repId_deadline = await bot.onReplyToMessage(chatId, msg_get_deadline.message_id, (msg_deadline) => {
						let s = msg_deadline.text.split('/');

						if (s.length != 3 || s[2].length != 4 || Number(s[0]) == NaN || Number(s[1]) == NaN || Number(s[2]) == NaN) {
							//error
							bot.sendMessage(chatId, GetLocalString(chatId, 'invalid_date_format'), { reply_to_message_id: msg_deadline.message_id });
							return;
						}

						bot.removeReplyListener(repId_deadline);

						let da = new Date(s[2], Number(s[1]) - 1, s[0])
						task_wd.deadline = da.toISOString();

						confermaCreazioneTask(task_wd, chatId, data.task);
					})
				}
				break;
			//#endregion

			//#region CREATE_TASK_WITHOUT_DEADLINE
			case CREATE_TASK_WITHOUT_DEADLINE:
				let task_wod = task_in_creazione[data.task];
				if (task_wod) confermaCreazioneTask(task_wod, chatId, data.task);
				break;
			//#endregion

			//#region CREATE_TASK_YES
			case CREATE_TASK_YES:
				answer = false;

				let task_to_create = task_in_creazione[data.task];
				if (task_to_create) {
					Connect((client, db) => {
						let t = db.collection(COLLECTION_TASK);

						t.insertOne(task_to_create).then(() => {
							bot.answerCallbackQuery(a.id);

							bot.editMessageText(GetLocalString(chatId, 'task_creation_successfull'), { chat_id: chatId, message_id: a.message.message_id });
							showMenu(chatId);
						}).catch((err) => {
							bot.answerCallbackQuery(a.id);

							console.log(err);
							bot.editMessageText(GetLocalString(chatId, 'task_creation_failed'), { chat_id: chatId, message_id: a.message.message_id });
							showMenu(chatId);
						});
						delete task_in_creazione[data.task];

						client.close();
					});
				}
				break;
			//#endregion

			//#region CREATE_TASK_NO
			case CREATE_TASK_NO:
				if (task_in_creazione[data.task]) {
					delete task_in_creazione[data.task];
				}
				bot.editMessageText(GetLocalString(chatId, 'abort_create_task'), { chat_id: chatId, message_id: a.message.message_id });
				break;
			//#endregion

			//#region SHOW_OPEN_TASK
			case SHOW_OPEN_TASK:
				answer = false;

				showTask(chatId, from_user, a, true);
				break;
			//#endregion

			//#region SHOW_NEXT_OPEN_TASK
			case SHOW_NEXT_OPEN_TASK:
				answer = false;

				showNextTask(chatId, from_user, data, a, true);
				break;
			//#endregion

			//#region SHOW_CLOSED_TASK
			case SHOW_CLOSED_TASK:
				answer = false;

				showTask(chatId, from_user, a, false);
				break;
			//#endregion

			//#region SHOW_NEXT_CLOSED_TASK
			case SHOW_NEXT_CLOSED_TASK:
				answer = false;

				showNextTask(chatId, from_user, data, a, false);
				break;
			//#endregion

			//#region DELETE_TASK
			case DELETE_TASK:
				bot.editMessageText(GetLocalString(chatId, 'confirm_delete_chat'), {
					chat_id: chatId,
					message_id: a.message.message_id,
					reply_markup: {
						"inline_keyboard": [
							[
								{ text: GetLocalString(chatId, 'yes'), callback_data: JSON.stringify({ action: DELETE_TASK_YES, id: data.id }) },
								{ text: GetLocalString(chatId, 'no'), callback_data: JSON.stringify({ action: DELETE_TASK_NO }) }
							]
						],
					}
				});
				break;
			//#endregion

			//#region DELETE_TASK_YES
			case DELETE_TASK_YES:
				answer = false;

				Connect((client, db) => {
					let t = db.collection(COLLECTION_TASK);

					t.deleteOne({ _id: new Mongo.ObjectID(data.id) }).then(() => {
						bot.answerCallbackQuery(a.id);

						bot.editMessageText(GetLocalString(chatId, 'delete_task_successfull'), { chat_id: chatId, message_id: a.message.message_id });
					}).catch((err) => {
						bot.answerCallbackQuery(a.id);

						console.log(err);
						bot.editMessageText(GetLocalString(chatId, 'delete_task_failed'), { chat_id: chatId, message_id: a.message.message_id });
					});

					client.close();
				});

				break;
			//#endregion

			//#region DELETE_TASK_NO
			case DELETE_TASK_NO:
				bot.editMessageText(GetLocalString(chatId, 'abort_delete_task'), { chat_id: chatId, message_id: a.message.message_id });
				break;
			//#endregion

			//#region COMPLETE_TASK
			case COMPLETE_TASK:
				answer = false;

				Connect((client, db) => {
					const up = db.collection(COLLECTION_TASK);
					up.updateOne({ _id: new Mongo.ObjectID(data.id) }, { $set: { aperta: false } }).then(() => {
						bot.answerCallbackQuery(a.id);
						client.close();
						bot.editMessageText(GetLocalString(chatId, 'complete_task_ok'), { chat_id: chatId, message_id: a.message.message_id });
						showMenu(chatId);
					}).catch((err) => {
						bot.answerCallbackQuery(a.id);
						console.log(err);
					});
				});
				break;
			//#endregion

			//#region UNCOMPLETE_TASK
			case UNCOMPLETE_TASK:
				answer = false;

				Connect((client, db) => {
					const up = db.collection(COLLECTION_TASK);
					up.updateOne({ _id: new Mongo.ObjectID(data.id) }, { $set: { aperta: true } }).then(() => {
						bot.answerCallbackQuery(a.id);
						client.close();
						bot.editMessageText(GetLocalString(chatId, 'uncomplete_task_ok'), { chat_id: chatId, message_id: a.message.message_id });
					}).catch((err) => {
						bot.answerCallbackQuery(a.id);
						console.log(err);
					});
				});
				break;
			//#endregion

			//#region JOIN_TASK
			case JOIN_TASK:
				answer = false;

				Connect((client, db) => {
					const up = db.collection(COLLECTION_TASK);
					up.findOne({ _id: new Mongo.ObjectID(data.id) }).then((d) => {
						let _task = Task.from(d);
						if (_task.partecipanti) {
							let b = _task.partecipanti.filter((a) => { return a._id == from_user });
							if (b.length == 0) {
								_task.partecipanti.push(new UserEntry(from_user, true));
							} else {
								b[0].attivo = true;
							}
						} else {
							_task.partecipanti = [];
							_task.partecipanti.push(new UserEntry(from_user, true));
						}
						up.updateOne({ _id: new Mongo.ObjectID(data.id) }, { $set: { partecipanti: _task.partecipanti } }, { upsert: true }).then(() => {
							bot.answerCallbackQuery(a.id);

							client.close();
							bot.editMessageText(GetLocalString(chatId, 'joined_task'), { chat_id: chatId, message_id: a.message.message_id });
							showMenu(chatId);
						});
					});
				});
				break;
			//#endregion

			//#region UNJOIN_TASK
			case UNJOIN_TASK:
				answer = false;

				Connect((client, db) => {
					const up = db.collection(COLLECTION_TASK);
					up.findOne({ _id: new Mongo.ObjectID(data.id) }).then((d) => {
						let _task = Task.from(d);
						if (_task.partecipanti) {
							let b = _task.partecipanti.filter((a) => { return a._id == from_user });
							if (b.length > 0) {
								b[0].attivo = false;

								up.updateOne({ _id: new Mongo.ObjectID(data.id) }, { $set: { partecipanti: _task.partecipanti } }, { upsert: true }).then(() => {
									bot.answerCallbackQuery(a.id);

									client.close();
									bot.editMessageText(GetLocalString(chatId, 'unjoined_task'), { chat_id: chatId, message_id: a.message.message_id });
									showMenu(chatId);
								});
							}
						}
					});
				});
				break;
			//#endregion

			//#region ADD_ACTIVITY
			case ADD_ACTIVITY:
				let activity = new ActivityEntry(undefined, undefined, from_user, data.id);
				let i = ID();
				activity_in_creazione[i] = activity;

				let msg_get_start_date = await bot.sendMessage(chatId, GetLocalString(chatId, 'ins_act_start_date'), {
					"reply_markup": {
						"force_reply": true
					}
				});

				let repId_start_date = await bot.onReplyToMessage(chatId, msg_get_start_date.message_id, async (msg_start_date) => {
					if (!validateDateTime(msg_start_date.text)) {
						bot.sendMessage(chatId, GetLocalString(chatId, 'invalid_date_format'), { reply_to_message_id: msg_start_date.message_id });
						return;
					}

					bot.removeReplyListener(repId_start_date);

					let r = msg_start_date.text.split(' ');
					let s = r[0].split('/');
					let t = r[1].split(':');

					let da = new Date(s[2], Number(s[1]) - 1, s[0], t[0], t[1]);
					activity_in_creazione[i].data_inizio = da;

					let msg_get_end_date = await bot.sendMessage(chatId, GetLocalString(chatId, 'ins_act_end_date'), {
						"reply_markup": {
							"force_reply": true
						}
					});
					let repId_end_date = await bot.onReplyToMessage(chatId, msg_get_end_date.message_id, (msg_end_date) => {
						if (!validateDateTime(msg_end_date.text)) {
							bot.sendMessage(chatId, GetLocalString(chatId, 'invalid_date_format'), { reply_to_message_id: msg_start_date.message_id });
							return;
						}

						bot.removeReplyListener(repId_end_date);

						let r = msg_end_date.text.split(' ');
						let s = r[0].split('/');
						let t = r[1].split(':');

						let da2 = new Date(s[2], Number(s[1]) - 1, s[0], t[0], t[1]);
						activity_in_creazione[i].data_fine = da2;

						confermaCreazioneActivity(activity_in_creazione[i], chatId, i, msg_end_date.from.username);
					});
				})

				function validateDateTime(text) {
					let r = text.split(' ');

					if (r.length != 2) {
						return false;
					}

					let s = r[0].split('/');

					if (s.length != 3 || s[2].length != 4 || Number(s[0]) == NaN || Number(s[1]) == NaN || Number(s[2]) == NaN) {
						return false;
					}

					let t = r[1].split(':');

					if (t.length != 2 || t[1].length > 2 || Number(t[1]) == NaN || t[0].length > 2 || Number(t[0]) == NaN) {
						return false;
					}

					return true;
				}

				break;
			//#endregion

			//#region CREATE_ACTIVITY_YES
			case CREATE_ACTIVITY_YES:
				answer = false;

				let activity_to_create = ActivityEntry.from(activity_in_creazione[data.activity]);
				if (activity_to_create) {
					Connect((client, db) => {
						const up = db.collection(COLLECTION_TASK);

						up.findOne({ _id: new Mongo.ObjectID(activity_to_create.id_task) }).then((d) => {
							let _task = Task.from(d);

							if (!_task.attivita)
								_task.attivita = [];

							_task.attivita.push(activity_to_create);

							up.updateOne({ _id: new Mongo.ObjectID(_task._id) }, { $set: { attivita: _task.attivita } }, { upsert: true }).then(() => {
								bot.answerCallbackQuery(a.id);

								client.close();
								bot.editMessageText(GetLocalString(chatId, 'activity_created'), { chat_id: chatId, message_id: a.message.message_id });
								showMenu(chatId);
							}).catch((err) => {
								bot.answerCallbackQuery(a.id);

								console.log(err);
								bot.editMessageText(GetLocalString(chatId, 'activity_creation_failed'), { chat_id: chatId, message_id: a.message.message_id });
								showMenu(chatId);
							});

							delete activity_in_creazione[data.activity];
						}).catch((err) => {
							bot.answerCallbackQuery(a.id);

							console.log(err);
							bot.editMessageText(GetLocalString(chatId, 'activity_creation_failed'), { chat_id: chatId, message_id: a.message.message_id });
							showMenu(chatId);
						});
					});
				}
				break;
			//#endregion

			//#region CREATE_ACTIVITY_NO
			case CREATE_ACTIVITY_NO:
				if (activity_in_creazione[data.activity]) {
					delete activity_in_creazione[data.activity];
				}
				bot.editMessageText(GetLocalString(chatId, 'abort_create_activity'), { chat_id: chatId, message_id: a.message.message_id });
				break;
			//#endregion

			default:
				break;
		}
		if (answer) bot.answerCallbackQuery(a.id);
	});

	bot.on('polling_error', (error) => {
		console.log(error);  // => 'EFATAL'
	});

	// Mostra la prossima task
	function showNextTask(chatId, from_user, data, a, apert) {
		if (data.d == 1) { // Se è presente solo una task
			bot.answerCallbackQuery(a.id);
			return;
		}
		Connect((client, db) => {
			db.collection(COLLECTION_TASK).find({ aperta: apert, chat: chatId }, { skip: data.i, limit: 1 }).toArray().then(async (d) => {
				bot.answerCallbackQuery(a.id);
				if (d.length == 0) {
					bot.sendMessage(chatId, GetLocalString(chatId, 'no_task'));
				}
				else {
					const el = d[0];

					let _task = Task.from(el);
					let userintask = _task.isPartecipante(from_user);

					let msg = GenerateTaskText(_task, chatId);

					let arrows = [
						{ text: '<', callback_data: JSON.stringify({ action: apert ? SHOW_NEXT_OPEN_TASK : SHOW_NEXT_CLOSED_TASK, i: (data.d + data.i - 1) % data.d, d: data.d }) },
						{ text: '>', callback_data: JSON.stringify({ action: apert ? SHOW_NEXT_OPEN_TASK : SHOW_NEXT_CLOSED_TASK, i: (data.d + data.i + 1) % data.d, d: data.d }) }
					];
					let inline_keyboard = getInlineKeyboard(apert, chatId, _task, userintask, from_user, arrows);

					bot.editMessageText(msg, {
						chat_id: chatId,
						message_id: a.message.message_id,
						reply_markup: {
							"inline_keyboard": inline_keyboard,
						}
					});
				}
			}).catch((err) => {
				console.log(err);
			});
			client.close();
		});
	}

	// Mostra la task
	function showTask(chatId, from_user, a, apert) {
		Connect((client, db) => {
			db.collection(COLLECTION_TASK).find({ aperta: apert, chat: chatId }).toArray().then((d) => {
				bot.answerCallbackQuery(a.id);
				if (d.length == 0) {
					bot.sendMessage(chatId, GetLocalString(chatId, 'no_task'));
				}
				else {
					const el = d[0];

					let _task = Task.from(el);
					let userintask = _task.isPartecipante(from_user);

					let arrows = [
						{ text: '<', callback_data: JSON.stringify({ action: apert ? SHOW_NEXT_OPEN_TASK : SHOW_NEXT_CLOSED_TASK, i: d.length - 1, d: d.length }) },
						{ text: '>', callback_data: JSON.stringify({ action: apert ? SHOW_NEXT_OPEN_TASK : SHOW_NEXT_CLOSED_TASK, i: 1, d: d.length }) }
					];
					let inline_keyboard = getInlineKeyboard(apert, chatId, _task, userintask, from_user, arrows);

					let msg = GenerateTaskText(_task, chatId);
					bot.sendMessage(chatId, msg, {
						"reply_markup": {
							"inline_keyboard": inline_keyboard,
						}
					});
				}
			}).catch((err) => {
				console.log(err);
			});
			client.close();
		});
	}

	/**
	 * Genera i bottoni di risposta per showTask e showNextTask
	 * 
	 * @param {Boolean} apert Specivica se si stanno mostrando le chat aperte
	 * @param {Number} chatId 
	 * @param {Task} el La task corrente
	 * @param {Boolean} userintask 
	 * @param {Number} from_user ID dell'utente che ha inviato il comando
	 * @param {*} arrows Array contenente le frecce per navigare le task
	 */
	function getInlineKeyboard(apert, chatId, el, userintask, from_user, arrows) {
		let inline_keyboard = [
			arrows,
			[{ text: apert ? GetLocalString(chatId, 'complete_task') : GetLocalString(chatId, 'uncomplete_task'), callback_data: JSON.stringify({ action: apert ? COMPLETE_TASK : UNCOMPLETE_TASK, id: el._id }) }],
			[{ text: !userintask ? GetLocalString(chatId, 'join_task') : GetLocalString(chatId, 'unjoin_task'), callback_data: JSON.stringify({ action: !userintask ? JOIN_TASK : UNJOIN_TASK, id: el._id, user: from_user }) }],
		];
		if (userintask && el.aperta)
			inline_keyboard.push([{ text: GetLocalString(chatId, 'add_activity'), callback_data: JSON.stringify({ action: ADD_ACTIVITY, id: el._id }) }]);
		inline_keyboard.push([{ text: GetLocalString(chatId, 'delete_task'), callback_data: JSON.stringify({ action: DELETE_TASK, id: el._id }) }]);
		return inline_keyboard;
	}

	/**
	 * Genera il testo per la visualizzazione della task
	 * @param {Task} el 
	 * @param {Number} chatId 
	 */
	function GenerateTaskText(el, chatId) {
		let date = undefined;
		if (el.deadline) {
			let da = el.getDataDeadline();
			date = da.getDate().toString() + "/" + (da.getMonth() + 1) + "/" + da.getFullYear();
		}
		let dc = el.getDataCreazione();
		let datec = dc.getDate().toString() + "/" + (dc.getMonth() + 1) + "/" + dc.getFullYear();
		let msg = GetLocalString(chatId, 'task') + '\n\n' +
			GetLocalString(chatId, 'name') + ': ' + el.nome + '\n' +
			GetLocalString(chatId, 'task_creation_date') + ': ' + datec;
		if (date)
			msg += '\n' + GetLocalString(chatId, 'deadline') + ': ' + date;

		if (el.attivita) {
			let totmin = 0;

			let users = [];

			el.attivita.forEach((act) => {
				act = ActivityEntry.from(act);
				totmin += Math.abs(act.getDataFine().getTime() - act.getDataInizio().getTime()) / 1000 / 60;
				if (users.indexOf(act.idutente) < 0) {
					users.push(act.idutente);
				}
			});

			let h = Math.floor(totmin / 60);
			let min = totmin - (60 * h);

			msg += '\n\n' + GetLocalString(chatId, 'duration') + ': ' + h.toString() + ' ' + GetLocalString(chatId, 'h') + ' ' + min.toString() + ' ' + GetLocalString(chatId, 'min');
			msg += '\n' + GetLocalString(chatId, 'oreuomo') + ': ' + (totmin / 60 / users.length).toString();
		}

		return msg;
	}

	/**
	 * Manda il messaggio di conferma per la creazione della task
	 * @param {Task} task 
	 * @param {Number} chatId 
	 * @param {String} temp_id Indice task nell'array temporaneo
	 */
	function confermaCreazioneTask(task, chatId, temp_id) {
		let date = undefined;
		if (task.deadline) {
			let da = task.getDataDeadline();
			date = da.getDate().toString() + "/" + (da.getMonth() + 1) + "/" + da.getFullYear();
		}

		let msg = GetLocalString(chatId, 'confirm_create_task') + '\n\n' + GetLocalString(chatId, 'name') + ': ' + task.nome;
		if (date) msg += '\n' + GetLocalString(chatId, 'deadline') + ': ' + date;
		msg += '\n\n' + GetLocalString(chatId, 'procede_create_task');

		bot.sendMessage(chatId, msg, {
			"reply_markup": {
				"inline_keyboard": [
					[
						{ text: GetLocalString(chatId, 'yes'), callback_data: JSON.stringify({ action: CREATE_TASK_YES, task: temp_id }) },
						{ text: GetLocalString(chatId, 'no'), callback_data: JSON.stringify({ action: CREATE_TASK_NO, task: temp_id }) }
					]
				],
			}
		});
	}

	/**
	 * Manda il messaggio per la creazione della ActivityEntry
	 * @param {ActivityEntry} activity 
	 * @param {Number} chatId 
	 * @param {String} temp_id
	 * @param {String} from_username
	 */
	function confermaCreazioneActivity(activity, chatId, temp_id, from_username) {
		let da_start = activity.getDataInizio();
		let da_end = activity.getDataFine();
		let date_start = da_start.getDate().toString() + "/" + (da_start.getMonth() + 1) + "/" + da_start.getFullYear() + " " + da_start.getHours() + ":" + da_start.getMinutes();
		let date_end = da_end.getDate().toString() + "/" + (da_end.getMonth() + 1) + "/" + da_end.getFullYear() + " " + da_end.getHours() + ":" + da_end.getMinutes();

		let msg = GetLocalString(chatId, 'confirm_create_activity') + '\n\n' +
			GetLocalString(chatId, 'user') + ': ' + (from_username ? from_username : activity.idutente) + '\n' +
			GetLocalString(chatId, 'activity_start_date') + ': ' + date_start + '\n' +
			GetLocalString(chatId, 'activity_end_date') + ': ' + date_end;
		msg += '\n\n' + GetLocalString(chatId, 'procede_create_activity');

		bot.sendMessage(chatId, msg, {
			"reply_markup": {
				"inline_keyboard": [
					[
						{ text: GetLocalString(chatId, 'yes'), callback_data: JSON.stringify({ action: CREATE_ACTIVITY_YES, activity: temp_id }) },
						{ text: GetLocalString(chatId, 'no'), callback_data: JSON.stringify({ action: CREATE_ACTIVITY_NO, activity: temp_id }) }
					]
				],
			}
		});
	}
}

function showMenu(chatid) {
	bot.sendMessage(chatid, "Menù", {
		"reply_markup": {
			"inline_keyboard": [
				[{ text: GetLocalString(chatid, 'create_task'), callback_data: JSON.stringify({ action: CREATE_TASK }) }],
				[{ text: GetLocalString(chatid, 'show_open_task'), callback_data: JSON.stringify({ action: SHOW_OPEN_TASK }) }],
				[{ text: GetLocalString(chatid, 'show_closed_task'), callback_data: JSON.stringify({ action: SHOW_CLOSED_TASK }) }]
			],
		}
	});
}

/**
 * Ritorna una stringa unica casuale
 * 
 * @returns {string} Stringa casuale unica
 */
function ID() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Ritorna la stringa richiesta nella lingua selezionata dall'utente
 * 
 * @param {Number} chatID Id della chat
 * @param {string} stringKey Chiave della stringa di taduzione
 * 
 * @returns {string} Stringa tradotta
 */
function GetLocalString(chatID, stringKey) {
	if (pref[chatID] && pref[chatID].lang) {
		return strings[pref[chatID].lang][stringKey];
	} else {
		return strings.en[stringKey];
	}
}

// Carica le preferenze degli utenti
Connect((client, db) => {
	db.collection(COLLECTION_USER_PREF).find().toArray().then((d) => {
		d.forEach((a) => {
			pref[a._id] = { lang: a.lang };
		})
	})
	client.close();

	initTg();
});

// Classes
class Task {
	/**
	 * 
	 * @param {Number} id
	 * @param {string} nome
	 * @param {UserEntry[]} partecipanti
	 * @param {ActivityEntry[]} attivita
	 * @param {string} data_creazione
	 * @param {Number} chat
	 * @param {Boolean} aperta
	 * @param {string} data_deadline 
	 */
	constructor(id, nome, partecipanti, attivita, data_creazione, chat, aperta, data_deadline) {
		/**
		 * ID
		 * @type {String}
		 */
		this._id = id;

		/**
		 * Nome della task
		 * @type {string}
		 */
		this.nome = nome;

		/**
		 * @type {UserEntry[]}
		 */
		this.partecipanti = partecipanti;

		/**
		 * @type {ActivityEntry[]}
		 */
		this.attivita = attivita;

		/**
		 * @type {string}
		 */
		this.data_creazione = data_creazione;

		/**
		 * ID della chat a cui la Task appertiene
		 * @type {Number}
		 */
		this.chat = chat;

		/**
		 * @type {Boolean}
		 */
		this.aperta = aperta;

		/**
		 * @type {string}
		 */
		this.deadline = data_deadline;
	}

	static from(task) {
		return new Task(task._id, task.nome, task.partecipanti, task.attivita, task.data_creazione, task.chat, task.aperta, task.deadline);
	}

	getDataCreazione() {
		if (this.data_creazione)
			return new Date(this.data_creazione);
	}

	getDataDeadline() {
		if (this.deadline)
			return new Date(this.deadline);
	}

	/**
	 * Verifica se l'utente è partecipande attivo della task corrente
	 * @param {Number} user ID dell'utente da verificare
	 * @returns {Boolean}
	 */
	isPartecipante(user) {
		if (this.partecipanti)
			return this.partecipanti.filter((v) => {
				return v._id == user && v.attivo
			}).length > 0;
	}
}

class UserEntry {
	/**
	 * 
	 * @param {Number} id
	 * @param {Number} id_utente
	 * @param {Boolean} attivo
	 */
	constructor(id_utente, attivo) {
		/**
		 * ID Utente
		 * @type {Number}
		 */
		this._id = id_utente;
		/**
		 * @type {Boolean}
		 */
		this.attivo = attivo;
	}

	static from(utente) {
		return new UserEntry(utente._id, utente.attivo);
	}
}

class ActivityEntry {
	/**
	 * 
	 * @param {Number} id 	
	 * @param {string} data_inizio 
	 * @param {string} data_fine 
	 * @param {Number} id_utente 
	 */
	constructor(data_inizio, data_fine, id_utente, id_task) {
		/**
		 * @type {string}
		 */
		this.data_inizio = data_inizio;
		/**
		 * @type {string}
		 */
		this.data_fine = data_fine;
		/**
		 * @type {Number}
		 */
		this.idutente = id_utente;
		/**
		 * @type {String}
		 */
		this.id_task = id_task;
	}

	static from(activity) {
		return new ActivityEntry(activity.data_inizio, activity.data_fine, activity.idutente, activity.id_task);
	}

	getDataInizio() {
		return new Date(this.data_inizio);
	}

	getDataFine() {
		return new Date(this.data_fine);
	}
}