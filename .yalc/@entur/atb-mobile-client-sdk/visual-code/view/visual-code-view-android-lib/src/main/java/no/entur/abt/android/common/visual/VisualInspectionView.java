/*-
 * #%L
 * Visual Inspection lib for android
 * %%
 * Copyright (C) 2019 Entur AS and original authors
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package no.entur.abt.android.common.visual;

import static no.entur.abt.android.common.visual.model.VisualCodePatternType.VERTICAL_STRIPES;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;
import android.graphics.drawable.shapes.RectShape;
import android.graphics.drawable.shapes.Shape;
import android.util.AttributeSet;
import android.util.Pair;
import android.view.View;

import no.entur.abt.android.common.visual.model.InvalidVisualCodeException;
import no.entur.abt.android.common.visual.model.InvertableVisualCode;
import no.entur.abt.android.common.visual.model.VisualCode;
import no.entur.abt.android.common.visual.model.VisualCodeColor;
import no.entur.abt.android.common.visual.model.VisualCodePatternType;
import no.entur.abt.android.common.visual.model.VisualCodeShape;
import no.entur.abt.android.common.visual.model.VisualCodeShapePosition;
import no.entur.abt.android.common.visual.model.VisualCodeShapeType;
import no.entur.abt.android.common.visual.shape.HeartShape;
import no.entur.abt.android.common.visual.shape.RhombusShape;
import no.entur.abt.android.common.visual.shape.StarShape;
import no.entur.abt.android.common.visual.shape.TriangleShape;

/**
 * View capable of rendering av VisualCode.
 */
public class VisualInspectionView extends View {

	private Rect dstFrame;
	private InvertableVisualCode visualCode;
	private static final int NO_OF_STRIPES = 12;
	private static final double FRAME_RATIO = 0.2;

	private int sizeFrame;
	private int frameLeftPadding;
	private int frameTopPadding;

	public VisualInspectionView(Context context, AttributeSet attributeSet) {
		super(context, attributeSet);
	}

	public boolean isInverted() {
		return visualCode.isReversed();
	}

	public void invertedView() {
		if (visualCode != null) {
			visualCode.invertedView();
			invalidate();
		}
	}

	public void standardView() {
		if (visualCode != null) {
			visualCode.standardView();
			invalidate();
		}
	}

	public void setVisualCode(InvertableVisualCode visualCode) {
		this.visualCode = visualCode;
		invalidate();
	}

	protected void onDraw(Canvas canvas) {
		if (visualCode != null) {
			VisualCode current = visualCode.getCurrent();

			Rect dstInner = calculateBounds(current);

			drawBackground(canvas, current, dstInner);
			current.getShapes().stream().map(s -> mapShape(s, dstInner)).forEach(drawable -> drawable.draw(canvas));
		} else {
			canvas.drawColor(Color.BLACK);
		}
	}

	private Rect calculateBounds(VisualCode current) {
		int sizeInner;
		if (current.hasFrame()) {
			sizeInner = (int) (sizeFrame * (1 - FRAME_RATIO));
		} else {
			sizeInner = sizeFrame;
		}

		int innerLeftPadding = frameLeftPadding + (sizeFrame - sizeInner) / 2;
		int innerTopPadding = frameTopPadding + (sizeFrame - sizeInner) / 2;
		return new Rect(innerLeftPadding, innerTopPadding, sizeInner + innerLeftPadding, sizeInner + innerTopPadding);
	}

	@Override
	protected void onSizeChanged(int x, int y, int ox, int oy) {
		sizeFrame = Math.min(x, y);

		frameLeftPadding = (x - sizeFrame) / 2;
		frameTopPadding = (y - sizeFrame) / 2;
		dstFrame = new Rect(frameLeftPadding, frameTopPadding, sizeFrame + frameLeftPadding, sizeFrame + frameTopPadding);
	}

	private void drawBackground(Canvas canvas, VisualCode visualCode, Rect dstInner) {
		// background
		Paint paint = new Paint();
		paint.setStyle(Paint.Style.FILL_AND_STROKE);
		paint.setFilterBitmap(false);
		paint.setAntiAlias(true);

		if (visualCode.hasFrame()) {
			paint.setColor(visualCode.getFrameColor());
			canvas.drawRect(dstFrame, paint);
		}

		VisualCodeColor primaryBackgroundColor = visualCode.getPrimaryBackgroundColor();
		VisualCodeColor secondaryBackgroundColor = visualCode.getSecondaryBackgroundColor();

		switch (visualCode.getBackgroundPattern()) {
		case UNIFORM: {
			paint.setColor(primaryBackgroundColor.getColor());
			canvas.drawRect(dstInner, paint);
			break;
		}
		case HORIZONTAL_STRIPES:
		case VERTICAL_STRIPES:
			drawBackgroundStripes(canvas, paint, primaryBackgroundColor.getColor(), secondaryBackgroundColor.getColor(), visualCode.getBackgroundPattern(),
					dstInner);
			break;
		}
	}

	private void drawBackgroundStripes(Canvas canvas, Paint paint, int primaryBackgroundColor, int secondaryBackgroundColor, VisualCodePatternType stripeType,
			Rect dstInner) {
		Bitmap bitmap = Bitmap.createBitmap(NO_OF_STRIPES, NO_OF_STRIPES, Bitmap.Config.ARGB_8888);
		Canvas c = new Canvas(bitmap);
		for (int i = 0; i < NO_OF_STRIPES; i++) {
			paint.setColor(i % 2 == 0 ? primaryBackgroundColor : secondaryBackgroundColor);
			if (stripeType == VERTICAL_STRIPES) {
				c.drawRect(i, 0f, i + 1f, NO_OF_STRIPES, paint);
			} else {
				c.drawRect(0f, i, NO_OF_STRIPES, i + 1f, paint);
			}
		}

		canvas.drawBitmap(bitmap, null, dstInner, paint);
	}

	private Drawable mapShape(VisualCodeShape shape, Rect dstInner) {
		ShapeDrawable drawable = new ShapeDrawable(getShape(shape.getType()));

		Pair<Integer, Integer> topLeft = getTopLeft(shape.getPosition(), dstInner);
		int left = topLeft.first;
		int top = topLeft.second;
		int right = left + dstInner.width() / 4;
		int bottom = top + dstInner.width() / 4;

		drawable.setBounds(left, top, right, bottom);
		drawable.getPaint().setColor(shape.getColor().getColor());

		return drawable;
	}

	private Shape getShape(VisualCodeShapeType type) {
		switch (type) {
		case CIRCLE:
			return new OvalShape();
		case SQUARE:
			return new RectShape();
		case HEART:
			return new HeartShape();
		case STAR:
			return new StarShape();
		case RHOMBUS:
			return new RhombusShape();
		case TRIANGLE:
			return new TriangleShape();
		}
		throw new InvalidVisualCodeException("Invalid visual code shape type: " + type);
	}

	private Pair<Integer, Integer> getTopLeft(VisualCodeShapePosition position, Rect dstInner) {
		int widthBlock = dstInner.width() / 8;
		int heightBlock = dstInner.width() / 8;
		switch (position) {
		case CENTER:
			return Pair.create(3 * widthBlock + dstInner.left, 3 * heightBlock + dstInner.top);
		case TOP_LEFT:
			return Pair.create(widthBlock + dstInner.left, heightBlock + dstInner.top);
		case TOP_RIGHT:
			return Pair.create(5 * widthBlock + dstInner.left, heightBlock + dstInner.top);
		case BOTTOM_LEFT:
			return Pair.create(widthBlock + dstInner.left, 5 * heightBlock + dstInner.top);
		case BOTTOM_RIGHT:
			return Pair.create(5 * widthBlock + dstInner.left, 5 * heightBlock + dstInner.top);

		}
		throw new InvalidVisualCodeException("Invalid visual code shape position: " + position);
	}

}
