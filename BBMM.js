function bbmm() {
    Orion.Print('"BotBerry seq init..."');

    var box1 = Orion.FindObject('Box1');
    var box2 = Orion.FindObject('Box2');

    if (!box1) {
        Orion.Print('Box1 not found.');
        return;
    }

    if (!box2) {
        Orion.Print('Box2 not found.');
        return;
    }

    var source = box1.Serial();
    var nadobaBox = box2.Serial();

    var potions = [
        [0x0F09, 0x0000, 0x0481], // Greater Strength
        [0x0F0C, 0x0000, 0x08A7], // Greater Heal
        [0x0F0B, 0x0000, 0x014D], // Total Refresh
        [0x0F09, 0x0003, 0x0003]  // Total Mana Refresh
    ];

    var nadobas = Orion.FindType(
        0x1843,
        'any',
        nadobaBox,
        '',
        '',
        '',
        false
    );

    for (var i = 0; i < potions.length; i++) {
        var potionGraphic = potions[i][0];
        var potionColor = potions[i][1];
        var nadobaColor = potions[i][2];

        var targetNadoba = null;

        for (var n = 0; n < nadobas.length; n++) {
            var nadoba = Orion.FindObject(nadobas[n]);

            if (nadoba && nadoba.Color() == nadobaColor) {
                targetNadoba = nadobas[n];
                break;
            }
        }

        if (!targetNadoba) {
            Orion.Print('Nadoba not found: 0x' + nadobaColor.toString(16));
            continue;
        }

        while (true) {
            var potionSerials = Orion.FindType(
                potionGraphic,
                potionColor,
                source,
                '',
                '',
                '',
                false
            );

            if (!potionSerials.length) {
                break;
            }

            Orion.MoveItem(potionSerials[0], 0, targetNadoba);
            Orion.Wait(500);
        }
    }

    Orion.Print('BB Says: "All potions sorted now."');
    }