import type { Participant, Track, TrackPublication } from 'livekit-client';
import type { PinState } from '@livekit/components-react';


export type TrackReferencePlaceholder = {
  participant: Participant;
  publication?: never;
  source: Track.Source;
};

/** @public */
export type TrackReference = {
  participant: Participant;
  publication: TrackPublication;
  source: Track.Source;
};

/** @public */
export type TrackReferenceOrPlaceholder = TrackReference | TrackReferencePlaceholder;

export function isTrackReference(trackReference: unknown): trackReference is TrackReference {
  if (typeof trackReference === 'undefined') {
    return false;
  }
  return (
    isTrackReferenceSubscribed(trackReference as TrackReference) ||
    isTrackReferencePublished(trackReference as TrackReference)
  );
}

function isTrackReferenceSubscribed(trackReference?: TrackReferenceOrPlaceholder): boolean {
  if (!trackReference) {
    return false;
  }
  return (
    trackReference.hasOwnProperty('participant') &&
    trackReference.hasOwnProperty('source') &&
    trackReference.hasOwnProperty('track') &&
    typeof trackReference.publication?.track !== 'undefined'
  );
}

function isTrackReferencePublished(trackReference?: TrackReferenceOrPlaceholder): boolean {
  if (!trackReference) {
    return false;
  }
  return (
    trackReference.hasOwnProperty('participant') &&
    trackReference.hasOwnProperty('source') &&
    trackReference.hasOwnProperty('publication') &&
    typeof trackReference.publication !== 'undefined'
  );
}

export function isTrackReferencePlaceholder(
  trackReference?: TrackReferenceOrPlaceholder,
): trackReference is TrackReferencePlaceholder {
  if (!trackReference) {
    return false;
  }
  return (
    trackReference.hasOwnProperty('participant') &&
    trackReference.hasOwnProperty('source') &&
    typeof trackReference.publication === 'undefined'
  );
}

/**
 * Returns a id to identify the `TrackReference` or `TrackReferencePlaceholder` based on
 * participant, track source and trackSid.
 * @remarks
 * The id pattern is: `${participantIdentity}_${trackSource}_${trackSid}` for `TrackReference`
 * and `${participantIdentity}_${trackSource}_placeholder` for `TrackReferencePlaceholder`.
 */
export function getTrackReferenceId(trackReference: TrackReferenceOrPlaceholder | number) {
  if (typeof trackReference === 'string' || typeof trackReference === 'number') {
    return `${trackReference}`;
  } else if (isTrackReferencePlaceholder(trackReference)) {
    return `${trackReference.participant.identity}_${trackReference.source}_placeholder`;
  } else if (isTrackReference(trackReference)) {
    return `${trackReference.participant.identity}_${trackReference.publication.source}_${trackReference.publication.trackSid}`;
  } else {
    throw new Error(`Can't generate a id for the given track reference: ${trackReference}`);
  }
}

export type TrackReferenceId = ReturnType<typeof getTrackReferenceId>;

/** Returns the Source of the TrackReference. */
export function getTrackReferenceSource(trackReference: TrackReferenceOrPlaceholder): Track.Source {
  if (isTrackReference(trackReference)) {
    return trackReference.publication.source;
  } else {
    return trackReference.source;
  }
}

export function isEqualTrackRef(
  a?: TrackReferenceOrPlaceholder,
  b?: TrackReferenceOrPlaceholder,
): boolean {
  if (a === undefined || b === undefined) {
    return false;
  }
  if (isTrackReference(a) && isTrackReference(b)) {
    return a.publication.trackSid === b.publication.trackSid;
  } else {
    return getTrackReferenceId(a) === getTrackReferenceId(b);
  }
}

/**
 * Check if the `TrackReference` is pinned.
 */
export function isTrackReferencePinned(
  trackReference: TrackReferenceOrPlaceholder,
  pinState: PinState | undefined,
): boolean {
  if (typeof pinState === 'undefined') {
    return false;
  }
  if (isTrackReference(trackReference)) {
    return pinState.some(
      (pinnedTrackReference) =>
        pinnedTrackReference.participant.identity === trackReference.participant.identity &&
        isTrackReference(pinnedTrackReference) &&
        pinnedTrackReference.publication.trackSid === trackReference.publication.trackSid,
    );
  } else if (isTrackReferencePlaceholder(trackReference)) {
    return pinState.some(
      (pinnedTrackReference) =>
        pinnedTrackReference.participant.identity === trackReference.participant.identity &&
        isTrackReferencePlaceholder(pinnedTrackReference) &&
        pinnedTrackReference.source === trackReference.source,
    );
  } else {
    return false;
  }
}

/**
 * Check if the current `currentTrackRef` is the placeholder for next `nextTrackRef`.
 * Based on the participant identity and the source.
 * @internal
 */
export function isPlaceholderReplacement(
  currentTrackRef: TrackReferenceOrPlaceholder,
  nextTrackRef: TrackReferenceOrPlaceholder,
) {
  // if (typeof nextTrackRef === 'number' || typeof currentTrackRef === 'number') {
  //   return false;
  // }
  return (
    isTrackReferencePlaceholder(currentTrackRef) &&
    isTrackReference(nextTrackRef) &&
    nextTrackRef.participant.identity === currentTrackRef.participant.identity &&
    nextTrackRef.source === currentTrackRef.source
  );
}