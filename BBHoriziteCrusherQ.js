var Scripts = Scripts || {};

(function (Scripts) {
    var BBHoriziteCrusherQ = (function () {
        function BBHoriziteCrusherQ() {}

        BBHoriziteCrusherQ.run = function () {
            var directions = [
                { text: 'North West', index: 7 },
                { text: 'North East', index: 1 },
                { text: 'South West', index: 5 },
                { text: 'South East', index: 3 },
                { text: 'North', index: 0 },
                { text: 'East', index: 2 },
                { text: 'South', index: 4 },
                { text: 'West', index: 6 }
            ];

            Orion.ClearJournal();

            Orion.CharPrint(
                Orion.GetSerial('self'),
                55,
                'BBHoriziteCrusherQ started'
            );

            while (true) {
                var found = -1;

                for (var i = 0; i < directions.length; i++) {
                    if (Orion.InJournal(directions[i].text)) {
                        found = directions[i].index;
                        break;
                    }
                }

                if (found >= 0) {
                    Orion.ClearJournal();
                    Orion.Step(found, true);
                    Orion.Wait(500);
                } else {
                    Orion.Wait(100);
                }
            }
        };

        return BBHoriziteCrusherQ;
    })();

    Scripts.BBHoriziteCrusherQ = BBHoriziteCrusherQ;
})(Scripts);

function BBHoriziteCrusherQ() {
    Scripts.BBHoriziteCrusherQ.run();
}