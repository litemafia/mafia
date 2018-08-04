(function(){
	"use strict";
	var Bot = { //объект бот
		role: '',
		command: 0,
		pulya: 0,
		stat: [0, 0, parseInt($('.moneyBalance').text()), parseInt($('.my .rating').text()), parseInt(my_expa)],
		phrases: [ ['хай', 'привет', 'прив всем', 'хелло', 'здорова', 'хорошей игры', 'гырик', 'всем хай', 'всем удачи', 'гр', 'ку', 'опять гр', 'садите я гр надоело'], ['молодчик', 'молорик', 'красава', 'космос', 'просто огонь', 'красавелло', 'супер', 'крутяк', 'норм', '(c)'], ['(f)', 'тупой', 'тормоз', 'днина', 'днарь', 'фейспалм', 'нуб', 'нубище'], ['плохо всё', 'проиграли(', 'ну как же так(', 'ну вот('], ['.', ':|', '8-)'] ],
		sink: function() { //дневной слив
			if (!Env.arrPlant[0]){
				if ((Bot.command == 1) || (($.inArray(Bot.command, [2,5,7,8]) + 1) && (!Env.counts()))){ //льем за своими
					Env.arrPartners.forEach(function (elem, i){
						try {
							var con = $('#upl_' + elem + ' .hint').text().substr(8).trim();
							if (con){
								var id = parseInt($('#upl_list li .nick:contains("' + con + '")').parents()[1].id.replace(/\D+/g, ""));
								setTimeout(function() { _GM_action('', 'vote', 2, [id, 0]); }, 2000);
							}
						} catch (e) {}
					});
					if ((pla_data["person"] == 8) && (!gam_data["v_cycle"])){ //начать тупой слив если смерт
						try {
							setTimeout(function() { _GM_action('', 'vote', 2, [Env.arrOpponents[Math.floor(Math.random() * Env.arrOpponents.length)], 0]); }, 2000);
						} catch (e) {}
					}
				}
			} else {
				if ((Bot.command == 1) || (!($.inArray(Env.arrPlant[0], Env.arrPartners) + 1)) || (($.inArray(Bot.command, [2,5,7,8]) + 1) && (Env.counts()))){ // льем даже напара, если соперников больше
					setTimeout(function() { _GM_action('', 'vote', 2, [Env.arrPlant[0], 0]); }, 2000);
				} else if (!Env.counts()){ //не льем напара, а голосуем за своими
					Env.arrPartners.forEach(function (elem, i){
						try {
							var id = parseInt($('#upl_list li .nick:contains("' + $('#upl_' + elem + ' .hint').text().substr(8) + '")').parents()[1].id.replace(/\D+/g, ""));
							setTimeout(function() { _GM_action('', 'vote', 2, [id, 0]); }, 2000);
						} catch (e) {}
					});
				}
			}
			if ($('#peppiBar').length) _GM_action('', 'pep_bomb', 'select', Math.floor(Math.random() * 2));
			try {
				var id = parseInt($('#upl_list .hint:contains("'+my_nick+'")').parents()[1].id.replace(/\D+/g, ""));
				setTimeout(function() { //лить в ответ
					_GM_action('', 'vote', 2, [id, 0]);
					//Bot.messages([2], [1], 3000);
				}, 2000); 
			} catch (e) {}
		},
		vote: function() { //ночной ход
			if (gam_data["v_cycle"]){
				var o = 0;
				if ((gam_data["v_cycle"] == 1) && ($.inArray(parseInt(gam_data["owner"]), Env.arrOpponents) + 1)){
					Env.arrOpponents.splice($.inArray(parseInt(gam_data["owner"]), Env.arrOpponents), 1);
					o = 1;
				}
				var h = Env.arrOpponents[Math.floor(Math.random() * Env.arrOpponents.length)];
				if (!h) h = Env.arrPartners[Math.floor(Math.random() * Env.arrPartners.length)];
				if (!h) h = Env.arrPlant[Math.floor(Math.random() * Env.arrPlant.length)];
				if ((Env.arrPartners.length) && ($.inArray(Bot.role, ['Медработник', 'Доктор', 'Свидетель']) + 1)){
					if (Env.arrPartners.length) h = Env.arrPartners[Math.floor(Math.random() * Env.arrPartners.length)];
				} else if (((Env.arrPlant.length) && ($.inArray(Bot.role, ['Вор', 'Стерва']) + 1)) || ((!Env.arrOpponents.length) && (Bot.role == 'Комиссар'))){
					h = Env.arrPlant[Math.floor(Math.random() * Env.arrPlant.length)];
				}
				if (o) Env.addArr(gam_data["owner"], 2);
				_GM_action('', 'vote', 2, [h, 0]);
				if (pla_data["person"] == 17) _GM_action('', 'tpower', 'select', '1');
			}
		},
		court: function( id ) { //суд
			if ((Bot.command == 1) && ($('.vs').text() == '1 : 2')) { //Если остался один против двух разных злых персонажей, то в суде оправдываем, чтобы они ночью друг друга били. Так есть шанс выжить
				_GM_action('', 'vote', 1, [id, 0]);
				Bot.messages(['мочите друг друга мне пофиг'], [1], 1000);
				return true;
			} else setTimeout(function() { _GM_action('', 'vote', (($.inArray(id, Env.arrPartners) + 1 == 0) || (Env.counts())) ? 2 : 1, [id, 0]); }, 2000); //2 - приг, 1 - опр
		},
		entry: function() { //вход в рум
			$($('#gml_list li[class=""]').get().reverse()).each(function() {
				var k = $(this).children()[2].innerText.split('/');
				var r = k[1] - k[0];
				if (($(this).children()[1].innerHTML.replace(/\D+/g, "") == my_league) && ($(this).children()[3].innerText == 20) && (r) && (r < 3) && (parseInt(k[1]) == 8)){
					_GM_action('gml', 'join', this.id.replace(/\D+/g, ""));
					return false;
				}
			});
		},
		exit: function() { //выход из рума
			_DLG('exit', 2);
		},
		startRead: function() { //чтение игрового чата, ловим таро, детекторы, жуки, паялы, провы
			$('#cco_log').bind("DOMNodeInserted", function(e){
				try {
					if ($(e.target).text().length > 39){ //39 минимальная возможная длина провы, чтобы отбросить большинство нубосообщений
						var s = $(e.target).text().split(':');
						if (s[0].trim().indexOf('сообщает') + 1){ //прова
							if (s[1].trim().indexOf('играет за граждан') + 1 == 0) { // ловим прову зла в чате
								var b = 0;
								var id = $('#upl_list li .nick:contains("'+s[1].trim().split('играет')[0].trim()+'")').parents()[1].id.replace(/\D+/g, "");
								if ((((s[1].trim().indexOf('играет за мафию') + 1) && (Bot.command == 2)) || ((s[1].trim().indexOf('играет за семью') + 1) && (Bot.command == 7))) && ($.inArray(id, Env.arrPartners) + 1 == 0)) b = 1;
								Env.addArr(id, 3, b);
								//Bot.messages(['ком', 1], [1], 3000);
							} else if ((Bot.command == 1) && (s[0].trim().indexOf('сообщает') + 1)) {
								var id = $('#upl_list li .nick:contains("'+s[1].trim().split(' играет ')[0].trim()+'")').parents()[1].id.replace(/\D+/g, "");
								Env.addArr(id, 1);
								Bot.messages(['я ' + Bot.role.toLowerCase().substring(0,3)], [2, id], 5000); //отписываем свою роль проверенному по прове
							}
						} else if (s[2]){ //таро, детектор, паялы, джокеры
							if ($.inArray(s[1].trim(), ['Карты таро раскрыли вам роль', 'Детектор лжи дал результаты', 'Пытки паяльником дали результат', 'Джокер раскрыл роль случайного игрока']) + 1){
								var arr = s[2].split('-');
								if ($.inArray(arr[1].trim(), ["Мафиози", "Босс мафии", "Двуликий", "Маньяк", "Чокнутый Профессор", "Зомби", "Потрошитель", "Подручный", "Жирный Тони", "Марко", "Франческа", "Розарио", "Тётушка Лин", "Якудза", "Гора", "Тень", "Чёрная Борода", "Хулиганка Пеппи"]) + 1) {
									var id = $('#upl_list li .nick:contains("'+arr[0].trim()+'")').parents()[1].id.replace(/\D+/g, "");
									if (arr[1].trim() == 'Двуликий') Env.dvulfra[0] = id;
									if (arr[1].trim() == 'Франческа') Env.dvulfra[1] = id;
									if (id == my_id) {
										Bot.messages(['это липа'], [1], 1000);
										setTimeout(function(){ Bot.messages(['не верьте ему!!!'], [1], 1000); }, 4000);
										setTimeout(function(){ Bot.messages(['ОПРАВДАЙТЕ ЭТО ЛИПА'], [1], 1000); }, 8000);
										setTimeout(function(){ Bot.messages(['он сам маф и липу кидает'], [1], 1000); }, 12000);
									} else {
										Env.addArr(id, 3);
										//Bot.messages([1], [1], 3000);
									}
								} else if (Bot.command == 1) {
									var id = $('#upl_list li .nick:contains("'+arr[0].trim()+'")').parents()[1].id.replace(/\D+/g, "");
									var idv = $('#upl_list li .nick:contains("'+s[0].trim()+'")').parents()[1].id.replace(/\D+/g, "");
									Bot.messages(['я ' + Bot.role.toLowerCase().substring(0,3)], [2, id], 5000); //отписываем свою роль проверенному по экстре
									Bot.messages(['я ' + Bot.role.toLowerCase().substring(0,3)], [2, idv], 8000); //отписываем свою роль тому кто кинул прову экстры на гр
									Env.addArr(id, 1);
									Env.addArr(idv, 1);
								}
							}
						} else if (s[1]){ //ловим активного чужого жука
							if (s[1].trim().indexOf('Вами прослушанный игрок ') + 1) {
								Env.addArr($('#upl_list li .nick:contains("'+s[1].trim().split('играет')[0].substr(24).trim()+'")').parents()[1].id.replace(/\D+/g, ""), 3);
							}
						} else if (s[0].indexOf(my_nick + ' подозревается') + 1) {
							Bot.messages(['без меня мирные проиграете опр меня'], [1], 2000);
							if ((Bot.command == 1) && (pla_data["person"] != 8)) setTimeout(function(){ Bot.messages([(my_gender == 'm') ? 'да чтоб у меня член отсох если я не мирный :D' : 'да чтоб у меня сиськи сдулись если я не мирная :D'], [1], 1000); }, 7000);
						} else if (s[0].indexOf('Вы продолжительное время сохраняете подозрительное молчание, Вас может настигнуть шальная пуля') + 1) {
							if (Bot.pulya) {
								Bot.messages([4], [1], 1000);
								Bot.pulya = 0;
							} else Bot.pulya = 1;
						} else if ($.inArray(Bot.command, [2, 7]) + 1){ //только для двула и франчески
							if (((Bot.command == 2) && (s[0].indexOf('Двуликий вступил в ряды Мафии и получил право на убийство граждан ночью') + 1)) || ((Bot.command == 7) && (s[0].indexOf('Франческа нашла семью Жирного Тони и получила право на убийство игроков ночью') + 1))){ //превращение двула и франчески в зло, чтобы собрать своих напаров
								$('#upl_list li').each(function (i, item){
									if (((Bot.command == 2) && ($.inArray($(this).children().attr('title'), ['Мафиози', 'Босс мафии', 'Двуликий']) + 1)) || ((Bot.command == 7) && ($.inArray($(this).children().attr('title'), ['Подручный', 'Жирный Тони', 'Марко', 'Розарио', 'Хулиганка Пеппи', 'Франческа']) + 1))){
										Env.addArr(item.id.replace(/\D+/g, ""), 1);
									}
								});
							}
						} else if (s[0].indexOf('Кто-то начал палить из «Корабельной пушки»! Жми на кнопку, чтобы уцелеть!') + 1) {
							_GM_action('', 'ship_cannon');
						}
					}
					if ((Bot.command == 1) && ($(e.target).text().length > 19)) { //добавляем в партнерский массив всех кто отписал в лс
						var s = $(e.target).text().split(':')[0].split(' » ');
						if (s[2].trim() == my_nick)	Env.addArr($('#upl_list li .nick:contains("'+s[0].trim()+'")').parents()[1].id.replace(/\D+/g, ""), 1);
					}
				} catch (e) {}
			});
		},
		stopRead: function() {
			$('#cco_log').unbind();
		},
		messages: function ( s, p, t ) {
			switch (p[0]){
				case 1: //общий чат
					_CHT_action('', 'smile', this.randomPhrases(s));
					break;
				case 2: //невидимая отправка в лс
					$.ajax({ 
						async: true, 
						cache: false, 
						type: "POST", 
						url: window.location.pathname + "DO/" + Math.random(), 
						data: {method: "cht_send", val: s[0] , sd: 1, 'opt[pv]': p[1]}, 
						dataType: "json", 
						success: function(data){}
					});
					break;
				case 3: //чат команды
					break;
			}
			setTimeout(function(){ _CHT_action('ich', 'send', 'close'); }, t);
		},
		randomPhrases: function ( a ) {
			var s = '';
			a.forEach(function ( e, i ) {
				var q = (isNaN(e)) ? e : Bot.phrases[e][Math.floor(Math.random() * Bot.phrases[e].length)];
				s += q + ' ';
			});
			return s.trim();
		}
	}
	var Env = { //объект окружающая среда
		gam_id: 0,
		dvulfra: [],
		commands: [["Гражданин","Комиссар","Сержант","Доктор","Медработник","Смертник","Стерва","Вор","Свидетель","Дед Мороз","Валентин","Добрый зайка","Гринч","Влюблённый","Кондитер","Вредный зайка","Нефритовый заяц","Костюмер","Франкенштейн","Привидение","Дракула","Бешеный пират"], ["Мафиози","Босс мафии","Двуликий"], ["Маньяк"], ["Валентин"], ["Чокнутый Профессор","Зомби"], ["Потрошитель"], ["Подручный","Жирный Тони","Марко","Франческа","Розарио","Хулиганка Пеппи"], ["Тётушка Лин","Якудза","Гора","Тень"],["Чёрная Борода"]],
		idcommands: { 1: [1,4,5,6,7,8,10,11,12,13,15,20,21,22,23,24,26,27,32,28,39], 2: [2,9,25], 3: [3], 4: [14], 5: [18,19], 6: [34], 7: [16,17,30,31,33,41], 8: [35,36,37,38], 9: [40] },
		counts: function() { //сравнение количеств живых напарников и противников
			var sum = parseInt(eval($('.vs').text().split(':').join('+')));
			var mycom = 0;
			this.idcommands[Bot.command].forEach(function ( e, i ) {
				if (gam_data['v_left'][e]) mycom += parseInt(gam_data['v_left'][e]);
			});
			if (((Bot.command == 2) && (gam_data['v_left'][9])) || ((Bot.command == 7) && (gam_data['v_left'][17]))){
				--sum;
			}
			return (sum / mycom) > 2 ? true : false; //если своих больше будет false, если противников больше - true
		},
		inactive: function() { //неактивная ночь
			if (this.gam_id != gam_id) {
				console.clear();
				Bot.stat[0]++;
				Bot.pulya = 0;
				var eco = Math.floor(parseInt($('.moneyBalance').text()) - Bot.stat[2]);
				if (eco > 0) eco = '+' + eco;
				var rat = Math.floor(parseInt($('.my .rating').text()) - Bot.stat[3]);
				if (rat > 0) rat = '+' + rat;
				console.info('Сыграно партий: ' + Bot.stat[0] + '. КПД: ' + Math.floor(100 - Bot.stat[1] * 100 / Bot.stat[0]) + '%. Количество смертей бота: ' + Bot.stat[1] + '. Смертность составляет: ' + Math.floor(Bot.stat[1] * 100 / Bot.stat[0]) + '%. Экономика: ' + eco + '. Заработанный ботом рейтинг: ' + rat + '. Заработанный опыт: ' + Math.floor(parseInt(my_expa) - Bot.stat[4]));
				this.arrPartners = []; //здесь напарники/союзники
				this.arrOpponents = []; //здесь противники
				this.arrPlant = []; //здесь на слив
				//Bot.messages([0], [1], 5000); //приветствие
				Bot.startRead();
				Bot.role = $('#upl_' + my_id + ' .ico').attr('title');
				Bot.command = this.identifyCommand(my_id);
				$('#upl_list li').each(function (i, item){
					if ($.inArray(Bot.command, [3,4,6,9]) + 1){ //если у бота одиночная роль, то всех остальных загоняем в противники
						Env.addArr(item.id.replace(/\D+/g, ""), 2);
					} else if ($(this).children().attr('title')) { //если в начале игры бот видит авы, то это напарники 
						var id = parseInt(item.id.replace(/\D+/g, ""));
						Env.addArr(item.id.replace(/\D+/g, ""), 1);
					} else {
						Env.addArr(item.id.replace(/\D+/g, ""), 2);
					}
				});
				this.gam_id = gam_id;
			}
		},
		addArr: function ( id, m, b ){
			if (id != my_id){
				Env.arrOpponents = $.grep(Env.arrOpponents, function(v) {
					return v != id;
				});
				Env.arrPlant = $.grep(Env.arrPlant, function(v) {
					return v != id;
				});				
				switch (m) {
					case 1: //в масси напарников
						if ($.inArray(parseInt(id), Env.arrPartners) + 1 == 0) Env.arrPartners.push(parseInt(id))
						break;
					case 2: //в массив соперников
						Env.arrOpponents.push(parseInt(id));
						break;
					case 3: //в массив слива
						Env.arrPlant.push(parseInt(id));
						if (b){
							Env.arrPartners.push(parseInt(id));
						}
						break;
				}
			}
		},
		identifyCommand: function ( id ){
			var r = $('#upl_' + id + ' .ico').attr('title');
			var res = 0;
			Env.commands.some(function (item, i){
				if ($.inArray(r, item) + 1){
					res = i + 1;
					return true;
				}
			});
			return res;			
		},
		refresh: function (){
			Env.arrOpponents.forEach(function(e, i){
				if (($('#upl_list #upl_' + e + ' .ico.idead').length) || (!$('#upl_list #upl_' + e))){
					Env.arrOpponents.splice(i, 1);
				}
			});
			Env.arrPartners.forEach(function(e, i){
				if (($('#upl_list #upl_' + e + ' .ico.idead').length) || (!$('#upl_list #upl_' + e))){
					Env.arrPartners.splice(i, 1);
				}
			});
			Env.arrPlant.forEach(function(e, i){
				if (($('#upl_list #upl_' + e + ' .ico.idead').length) || (!$('#upl_list #upl_' + e))){
					Env.arrPlant.splice(i, 1);
				}
			});
			var s = parseInt(eval($('.vs').text().split(':').join('+')));
			if ((s == 2) && (Env.arrOpponents.length)){
				Env.addArr(Env.arrOpponents[0], 3);
			} else if ((s == 2) && (Env.arrPartners.length)){
				Env.addArr(Env.arrPartners[0], 3);
			}
			if ((Bot.command == 1) && (!Env.arrPlant.length) && (Env.arrOpponents.length == parseInt($('.vs').text().split(':')[1]))){
				Env.arrOpponents.forEach(function(e, i){
					Env.addArr(e, 3);
				});
			}
		},
		clear: function() {
			if ($('.containerEraser').length) $('.containerEraser').remove();
		}
	}
	setInterval(function(){
		switch (ifc_mode) {
			case 'chat': //в коридоре
				Bot.stopRead();
				Bot.entry();
				break;
			case 'room': //в наборе				
				[12345,23456,654321].forEach(function(e, i){ //выход, если в наборе пристуствует модер. Поиск по ид
					if ($('#gpl_list #gpl_' + e).length) {
						$('#gml_' + gam_id).remove();
						Bot.exit();
					}
				});
				break;
			case 'game': //в игре
				if (!pla_data['dead']){
					Env.inactive();
					Env.refresh();
					if (gam_data['v_mode']){ //день
						if (!pla_data["freeze"]){ //если не в морозе
							if (pla_data['kvt']){ //суд
								Bot.court(pla_data['kvt']);
							} else if ((!pla_data['act']) && (!$('li .x2vote, li .reanim, li .z_ghost').length)){ //дневной слив
								Bot.sink();
							}
						}
					} else if ((!pla_data['act']) && (!($.inArray(pla_data["person"], [1,5,7,8]) + 1))){ //ночь
						Bot.vote();
					}
					$($('.footerButtons').find('button')[0]).click();
				} else {
					Bot.stat[1]++;
					Bot.exit();
				}
				break;
		}
		Env.clear();
	},2000);
})();