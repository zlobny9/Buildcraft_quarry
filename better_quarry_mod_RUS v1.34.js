
/* * * * *
 * 
 *  Название        :   Better Quarry Mod
 *  Автор           :   @RhanCandia
 *  Переводчик      :   Nikich21
 *  Описание        :   Карьер как в моде Buildcraft на пк. Но он не совершенен.
 *  Дата            :   Янв. 20, 2015
 *  Посл. изм.      :   Янв. 20, 2015
 *  Права           :   RhanCandia (c) 2015
 *
 * * * * */
function newLevel()
{
clientMessage("Better Quarry Mod русская версия")
clientMessage("Автор       :   @RhanCandia")
clientMessage("Переводчик  :   Nikich21")
}

var yaw;
var direction;

var quarryBlock;
var quarryLimiter;
var quarryDrill;

var quarryDimension;
var speedInSeconds;
var quarrySpeed;

var quarryTicker;
var quarrActive;
var quarryTrigger;

var diggingX;
var diggingY;
var diggingZ;

var sourceX, sourceY, sourceZ;

var quarryX, quarryY, quarryZ;

function newLevel() {

    machineblock = 214
    quarryBlock = 215;
	quarryLimiter = 216;
	quarryDrill = 217;

	quarryDimension = 8;
	speedInSeconds = 16;
	quarrySpeed = 20 * speedInSeconds;

	quarryTicker = 0;
	quarrActive = false;
	quarryTrigger = false;

Item.addShapedRecipe(212, 1, 0, [
		"iii",
		"iei",
		"iii"
	], 
	["i", 265, 0, "e", 213, 0]);
	
ModPE.setItem(212, "factory_wrench", 0, "Гаечный ключ")
Player.addItemCreativeInv(212, 2);

Item.addShapedRecipe(212, 1, 0, [
		" t ",
		" st",
		"t  "
	], 
	["s", 213, 0, "t", 265, 0]);

ModPE.setItem(213, "gear", 0, "Шестерня")
Player.addItemCreativeInv(213, 2);

Item.addShapedRecipe(213, 1, 0, [
		"sss",
		"sts",
		"sss"
	], 
	["s", 331, 0, "t", 264, 0]);
	
	// Let's define the Machine Block!

Block.defineBlock(machineblock, "Основа для машины", [["furnace_top", 0], ["machine_block_top", 0], ["furnace_top", 0], ["furnace_top", 0], ["furnace_top", 0], ["furnace_top", 0]], 20, false);
	Player.addItemCreativeInv(machineblock, 2);
	
	Block.setDestroyTime(machineblock, 2);
	
	Item.addShapedRecipe(machineblock, 1, 0, [
		"iei",
		"ere",
		"iei"
	], 
	["r", 331, 0, "i", 265, 0, "e", 213, 0]);
	
	Block.defineBlock(quarryBlock, "Карьер", [["furnace_top", 0], ["piston_inner", 0], ["furnace_top", 0], ["quarry_top", 0], ["furnace_top", 0], ["furnace_top", 0]], 20, false);
	Player.addItemCreativeInv(quarryBlock, 1);
	Item.setCategory(quarryBlock, ItemCategory.DECORATION, 0);

	Block.setDestroyTime(quarryBlock, 2);

	Item.addShapedRecipe(quarryBlock, 1, 0, [
		"drd",
		"dmd",
		"dpd"
	], 
	["d", 264, 0, "r", 331, 0, "g", 266, 0, "i", 265, 0, "p", 278, 0, "m", 214, 0]);

	// Let's define the Quarry Limiter!

	Block.defineBlock(quarryLimiter, "Карьерное заграждение", ["furnace_top", 1], 20, false, 11);
	Item.setCategory(quarryLimiter, ItemCategory.DECORATION, 0);

	Block.setDestroyTime(quarryLimiter, 4);

	// Let's define the Quarry Drill!

	Block.defineBlock(quarryDrill, "Карьерный бур", [["piston_inner", 0], ["drill_top", 0], ["furnace_top", 0], ["furnace_top", 0], ["furnace_top", 0], ["furnace_top", 0]], 20, false);
	Item.setCategory(quarryDrill, ItemCategory.DECORATION, 0);

	Block.setDestroyTime(quarryDrill, 6);

}

function useItem(x, y, z, item, block, side) {

	if (item == quarryBlock && block != quarryBlock) {

		// Place Quarry and Limiters

		if (side == 1) {
			switch(direction) {
				case 1:
					setLimiters(x, (y + 1), ((z + quarryDimension) + 1), quarryLimiter);
					break;
				case 2:
					setLimiters((x - quarryDimension), (y + 1), z, quarryLimiter)
					break;
				case 3:
					setLimiters(x, (y + 1), (z - quarryDimension), quarryLimiter);
					break;
				case 4:
					setLimiters(((x + quarryDimension) + 1), (y + 1), z, quarryLimiter);
					break;
			}
		}
	}

	if (block == quarryBlock && (item == 212 )) {

		// Let's dig in

		quarryX = x;
		quarryY = y;
		quarryZ = z;

		if (!(quarrActive)) {

			clientMessage("Карьер активирован!");

			switch(direction) {
				case 1:
					startDigging(x, (y - 1), ((z + quarryDimension) + 1));
					break;
				case 2:
					startDigging((x - quarryDimension), (y - 1), z)
					break;
				case 3:
					startDigging(x, (y - 1), (z - quarryDimension));
					break;
				case 4:
					startDigging(((x + quarryDimension) + 1), (y - 1), z);
					break;
			}
		} else {

			clientMessage("Карьер деактивирован!");

			quarrActive = false;
			quarryTicker = 0;
		}

		preventDefault();
	}


}

function setLimiters(a, b, c, block) {
	
	for (var i = (a - quarryDimension); i < (a + quarryDimension); i++) {
		for (var k = (c - quarryDimension); k < (c + quarryDimension); k++) {
			if (i == (a - quarryDimension) || i == ((a + quarryDimension) - 1) || k == (c - quarryDimension) || k == ((c + quarryDimension) - 1)) {
				setTile(i, b, k, block);
			} else {
				setTile(i, b, k, 0);
			}
		}
	}

	sourceX = a;
	sourceY = b;
	sourceZ = c;

	setTile(a, b, c, quarryDrill);

}

function startDigging(a, b, c) {

	diggingX = a;
	diggingY = b;
	diggingZ = c;

	for (var j = diggingY + 4; j > 4; j--) {
		if (getTile(diggingX, j, diggingZ) == quarryDrill) {
			diggingY = j - 1;
			break;
		}
	}

	quarrActive = true;

}

function modTick() {

	if (quarrActive) {
		quarryTicker++;
		// clientMessage(quarryTicker % 20);
	}

	if ((quarryTicker % quarrySpeed == 0) && (quarrActive)) {

		for (var i = (diggingX - quarryDimension); i < (diggingX + quarryDimension); i++) {
			for (var k = (diggingZ - quarryDimension); k < (diggingZ + quarryDimension); k++) {
				if (Level.getTile(i, diggingY, k) != 0 || Level.getTile(i, diggingY, k) != 7) {
					switch(getTile(i, diggingY, k)) {
						case 14:
						case 15:
						case 16:
						case 21:
						case 56:
						case 73:
						case 74:
						case 129:
							if (getTile(quarryX, quarryY + 1, quarryZ) == 54) {
								
								var slots = 27;

								if (getTile(quarryX, quarryY + 1, quarryZ + 1) + 1 == 54) {
									slots += 27;
								} else if (getTile(quarryX, quarryY + 1, quarryZ - 1) == 54) {
									slots += 27;
								} else if (getTile(quarryX + 1, quarryY + 1, quarryZ) == 54) {
									slots += 27;
								} else if (getTile(quarryX - 1, quarryY + 1, quarryZ) == 54) {
									slots += 27;
								}

								var set = false;

								for (var t = 0; t < slots; t++) {
									if (Level.getChestSlot(quarryX, quarryY + 1, quarryZ, t) == getTile(i, diggingY, k)) {
										if (Level.getChestSlotCount(quarryX, quarryY + 1, quarryZ, t) < 64) {
											Level.setChestSlot(quarryX, quarryY + 1, quarryZ, t, getTile(i, diggingY, k), 0, (Level.getChestSlotCount(quarryX, quarryY + 1, quarryZ, t) + 1));
											set = true;
										} else {
											continue;
										}
									}
								}

								if (!(set)) {
									for (var t = 0; t < slots; t++) {
										if (Level.getChestSlot(quarryX, quarryY + 1, quarryZ, t) == 0) {
											Level.setChestSlot(quarryX, quarryY + 1, quarryZ, t, getTile(i, diggingY, k), 0, 1);
											set = true;
											break;
										}
									}	
								}

								if (!(set)) {
									Level.dropItem(quarryX, (quarryY + 2), quarryZ, 0.02, getTile(i, diggingY, k), 1, 0);
								}

							} else {
								Level.dropItem(quarryX, (quarryY + 1), quarryZ, 0.02, getTile(i, diggingY, k), 1, 0);
							}
						break;
					}
					setTile(i, diggingY, k, 0);
					setTile(diggingX, (diggingY + 1), diggingZ, 0);
				}
			}
		}

		if (diggingY < 4) {
			quarrActive = false;
			quarryTicker = false;
		} else {
			setTile(diggingX, diggingY, diggingZ, quarryDrill);
			diggingY--;
		}

	}

	yaw = Math.abs(Math.round(getYaw()) % 360);

	if (yaw >= 45 && yaw < 135) {
		direction = 2;
	} else if (yaw >= 135 && yaw < 225) {
		direction = 3;
	} else if (yaw >= 225 && yaw < 315) {
		direction = 4;
	} else {
		direction = 1;
	}

}

function leaveGame() {
	quarrActive = false;
}