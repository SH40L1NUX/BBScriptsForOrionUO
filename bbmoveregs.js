function bbmoveregs()
{
    // ==================================================
    // CONFIGURATION
    // ==================================================

    var targetContainer = 'Box2';

    var targetY = 122;
    var minX = 1;
    var slotsPerReagent = 8;
    var waitBetweenMoves = 500;
    var maxRetries = 3;

    // ==================================================
    // STANDARD REAGENTS
    // ==================================================

    var regs = [
        '0x0F7A', // Black Pearl
        '0x0F86', // Mandrake Root
        '0x0F88', // Nightshade
        '0x0F8C', // Sulfurous Ash
        '0x0F84', // Garlic
        '0x0F85', // Ginseng
        '0x0F8D', // Spider's Silk
        '0x0F7B'  // Blood Moss
    ];

    // ==================================================
    // ADDITIONAL / NECROMANCY REAGENTS
    // ==================================================

    var necroRegs = [
        '0x0F78', // Bat Wing
        '0x0F7D', // Daemon Blood
        '0x0F80', // Daemon Bones
        '0x0F8F', // Volcanic Ash
        '0x0F8E', // Serpent's Scales
        '0x0F81', // Fertile Dirt
        '0x0F89', // Obsidian
        '0x0F82', // Dragon's Blood
        '0x0F83', // Executioner's Cap
        '0x0F79', // Blackmoor
        '0x0F7C', // Bloodspawn
        '0x0F8B', // Pumice
        '0x0F91', // Wyrm's Hearts
        '0x0F7F', // Brimstone
        '0x0F87'  // Eyes of Newt
    ];

    // ==================================================
    // RESOLVE CONTAINERS
    // ==================================================

    var backpack = Orion.ObjAtLayer('Backpack');

    if (!backpack)
    {
        Orion.Print('ERROR: Cannot find backpack.');
        return;
    }

    var backpackSerial = backpack.Serial();
    var targetObject = Orion.FindObject(targetContainer);

    if (!targetObject)
    {
        Orion.Print('ERROR: Cannot find alias ' + targetContainer);
        return;
    }

    var targetSerial = targetObject.Serial();

    // ==================================================
    // TRANSFER COUNTERS
    // ==================================================

    var moved = 0;
    var failed = 0;
    var capacityWarnings = 0;

    // ==================================================
    // CHECK WHETHER AN ITEM REMAINS IN THE BACKPACK
    // ==================================================

    function itemStillInBackpack(graphic, serial)
    {
        var items = Orion.FindType(
            graphic,
            '0xFFFF',
            backpackSerial,
            'any',
            'any',
            'any',
            false
        );

        if (!items)
        {
            return false;
        }

        for (var i = 0; i < items.length; i++)
        {
            if (String(items[i]) == String(serial))
            {
                return true;
            }
        }

        return false;
    }

    // ==================================================
    // MOVE ONE REAGENT TYPE INTO ITS OWN X RANGE
    // ==================================================

    function transferReagent(graphic, reagentIndex)
    {
        var startX = minX + (reagentIndex * slotsPerReagent);
        var endX = startX + slotsPerReagent - 1;
        var currentX = startX;
        var reagentMoved = 0;

        Orion.Print(
            'Processing ' + graphic +
            ' at X=' + startX + '-' + endX
        );

        while (true)
        {
            // Refresh the search after every move.
            var items = Orion.FindType(
                graphic,
                '0xFFFF',
                backpackSerial,
                'any',
                'any',
                'any',
                false
            );

            if (!items || items.length === 0)
            {
                break;
            }

            // Never reuse another reagent's coordinates.
            if (currentX > endX)
            {
                Orion.Print(
                    'CAPACITY WARNING: ' + graphic +
                    ' has remaining stacks in backpack; ' +
                    'its 8 positions are full.'
                );

                capacityWarnings++;
                break;
            }

            var itemSerial = items[0];
            var success = false;

            // Retry the same item and position if necessary.
            for (var attempt = 1; attempt <= maxRetries; attempt++)
            {
                Orion.MoveItem(
                    itemSerial,
                    0,
                    targetSerial,
                    currentX,
                    targetY
                );

                Orion.Wait(waitBetweenMoves);

                // Confirm the exact item left the backpack.
                if (!itemStillInBackpack(graphic, itemSerial))
                {
                    success = true;
                    break;
                }

                Orion.Print(
                    'Retry ' + attempt + '/' + maxRetries +
                    ' for ' + graphic
                );
            }

            if (!success)
            {
                Orion.Print(
                    'ERROR: Move failed for ' + graphic +
                    '. Remaining stacks will be left in backpack.'
                );

                failed++;
                break;
            }

            // Advance only after the item leaves the backpack.
            moved++;
            reagentMoved++;
            currentX++;
        }

        Orion.Print(
            'Finished ' + graphic +
            '. Stacks moved: ' + reagentMoved
        );
    }

    // ==================================================
    // PROCESS EVERY REAGENT TYPE
    // ==================================================

    Orion.Print('Starting reagent transfer to Box2.');

    var reagentIndex = 0;

    for (var i = 0; i < regs.length; i++)
    {
        transferReagent(regs[i], reagentIndex);
        reagentIndex++;
    }

    for (var j = 0; j < necroRegs.length; j++)
    {
        transferReagent(necroRegs[j], reagentIndex);
        reagentIndex++;
    }

    // ==================================================
    // FINAL REPORT
    // ==================================================

    Orion.Print('================================');
    Orion.Print('REAGENT TRANSFER FINISHED');
    Orion.Print('Reagent types processed: ' + reagentIndex);
    Orion.Print('Stacks successfully moved: ' + moved);
    Orion.Print('Failed reagent types: ' + failed);
    Orion.Print('Full allocation warnings: ' + capacityWarnings);
    Orion.Print('Destination: Box2');
    Orion.Print('Placement row: Y=' + targetY);
    Orion.Print(
        'X range: ' + minX + '-' +
        (minX + reagentIndex * slotsPerReagent - 1)
    );
    Orion.Print('Move delay: ' + waitBetweenMoves + ' ms');
    Orion.Print('================================');

    if (failed > 0 || capacityWarnings > 0)
    {
        Orion.Print(
            'WARNING: Check backpack for remaining reagents.'
        );
    }
    else
    {
        Orion.Print(
            'All listed reagent types have been processed.'
        );
    }
}
