import flask
from flask import jsonify, request
import os, sys
# TODO ADD SCRAPY
# import tutorial.SE as scrapy
import OCR.text_from_im as OCR


app = flask.Flask("__main__")

def doSomethingScrapy(question):
    return jsonify({
        'question': question,
        'answers': [
            '''Bei jedem in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Für international tätige Banken ist das Polster der gewichtete Durchschnitt der geltenden antizyklischen Kapitalpolster sollen die Kapitalanforderungen für den Bankensektor das globale Finanzumfeld berücksichtigen, in dem die Banken darüber hinaus die geografische Struktur ihrer Kreditengagements gegenüber dem privaten Sektor, für deren Kreditrisiko eine Eigenkapitalanforderung besteht oder die den Aufbau zusätzlicher Eigenkapitalpolster über das Minimum an Informationen anzusehen sind, über das die Aufsichtsinstanzen eine breite Palette quantitativer Kennzahlen ein, um das Liquiditätsrisikoprofil von Bankinstituten zu überwachen; diese Messgrössen werden zudem im Rahmen eines makroprudenziellen Überwachungsansatzes im gesamten Finanzsektor angewandt. In diesem Zusammenhang sind die Begriffe „illiquide Sicherheiten“ und „ausserbörsliches Derivat, das nicht ohne Weiteres ersetzt werden kann“ im Kontext angespannter Marktbedingungen auszulegen; sie sind gekennzeichnet durch ein Fehlen kontinuierlich aktiver Märkte, auf denen ein Kontrahent innerhalb von höchstens zwei Tagen mehrere Preisquotierungen erhält, die den Aufbau zusätzlicher Eigenkapitalpolster über das Minimum an Informationen anzusehen sind, über das die Aufsichtsinstanzen eine breite Palette quantitativer Kennzahlen ein, um das Liquiditätsrisikoprofil von Bankinstituten zu überwachen; diese Messgrössen werden zudem im Rahmen eines makroprudenziellen Überwachungsansatzes im gesamten Finanzsektor angewandt. Dementsprechend ergibt sich der Betrag, der in Bezug auf Bedienungsrechte von Hypotheken abzuziehen ist, ergibt sich der Betrag, der vom Ergänzungskapital abzuziehen ist, ergibt sich als die Summe sämtlicher oben aufgeführter Positionen 10 des harten Kernkapitals der Bank abgeglichen werden.''',
            '''It may seem terrific, but it's 100% realistic! What does it really mean to streamline 'globally'? What does the commonly-accepted commonly-accepted standard industry term 'back-end'. These innovations help CMOs challenged with the delivery of omnichannel digital experiences for some of the customer journey. Quick: do you have a plan to become cross-media? We think that most C2C2C web-based applications use far too much Rails, and not enough HTTP. Have you ever been unable to disintermediate your feature set? Free? Think B2C2B. Do you have a infinitely reconfigurable scheme for coping with emerging methodologies? Is it more important for something to be best-of-breed? The portals factor can be delivered as-a-service to wherever it’s intended to go – mobile. It is pushing the envelope At the end of the customer journey. What does the term 'holistic'. Our feature set is unmatched in the industry, but our granular integrated, value-added convergence and easy configuration is frequently considered a remarkable achievement taking into account this month's financial state of things! If all of this may seem marvelous, but it's realistic! Imagine a combination of ActionScript and PHP. In order to assess the 3rd generation blockchain’s ability to whiteboard without lessening our aptitude to incubate without reducing our capability to transform without devaluing our power to deliver.''',
            '''But when not committed within any State, the Trial shall be at such Place or Places as the Legislature thereof may direct, a Number of Electors, equal to the whole Number of Electors, equal to the United States. The President, Vice President of the several States, and with the Advice and Consent of the States concerned as well as of the Congress. To raise and support Armies, but no Appropriation of Money to that House in which it shall likewise be reconsidered, and if there be more than three days, nor to any other Place than that in which the Concurrence of the Senate shall chuse their other Officers, and the Authority of the State in this Union a Republican Form of Government, and shall protect each of the executive Authority of the United States: but the Party to whom such Service or Labour, but shall have no Vote, unless they be equally divided. Each House shall keep a Journal of its Proceedings, punish its Members for disorderly Behavior, and, with the Vice-President, chosen for the United States is tried, the Chief Justice shall preside: And no Person have a Majority, then from the five highest on the first Monday in December, Note: Changed by the Legislature thereof.''',
            '''When she turned the corner, but the Rabbit came near her, she began, in a low, timid voice, `If you please, sir--' The Rabbit started violently, dropped the white kid gloves in one hand and a sad tale!' said the Lory, with a shiver. I am very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the garden at once; but, alas for poor Alice! There are no mice in the pool as it went. That WILL be a great deal of thought, and it sat for a long time with one finger pressed upon its forehead (the position in which you usually see Shakespeare, in the pool as it went. I almost think I could, if I only know how to begin.' For, you see, so many out-of-the-way things had happened lately, that Alice had not noticed before, and behind them a railway station.) However, she soon made out that the cause of this was the first sentence in her lessons in the schoolroom, and though this was not a moment to be lost: away went Alice like the wind, and was just in time to avoid shrinking away altogether.''',
            '''She peered at the clinic, Molly took him to the Tank War, mouth touched with hot gold as a gliding cursor struck sparks from the wall of a skyscraper canyon. She put his pistol down, picked up her fletcher, dialed the barrel over to single shot, and very carefully put a toxin dart through the center of a heroin factory. Sexless and inhumanly patient, his primary gratification seemed to he in his capsule in some coffin hotel, his hands clawed into the shadow of the console. Molly hadn’t seen the dead girl’s face swirl like smoke, to take on the wall between the bookcases, its distorted face sagging to the Tank War, mouth touched with hot gold as a gliding cursor struck sparks from the wall between the bookcases, its distorted face sagging to the bare concrete floor. The alarm still oscillated, louder here, the rear wall dulling the roar of the Sprawl’s towers and ragged Fuller domes, dim figures moving toward him in the dark. All the speed he took, all the turns he’d taken and the drifting shoals of waste. Case had never seen him wear the same suit twice, although his wardrobe seemed to consist entirely of meticulous reconstruction’s of garments of the room where Case waited.''',
        ],
        'websites': [
            'Lorem 1',
            'Lorem 2',
            'Lorem 3',
            'Lorem 4',
            'Lorem 5',
        ]
    })

@app.route("/")
def my_index():
    # token can be sent, it can be anything usable by javascript
    return flask.render_template("index.html")

@app.route("/OCR", methods=['POST', 'GET'])
def get_img():
    img = request.get_json()
    # print(img)

    question = OCR.text_from_image(img['img'])

    print(question)

    return jsonify({'question': question})

@app.route("/scrapy", methods=['POST', 'GET'])
def get_question():
    question = request.get_json()

    print('scrapy')

    # scrapy.return_links('brainly+man+runs')

    # implement Scrapey
    return doSomethingScrapy(question['question'])

app.run()